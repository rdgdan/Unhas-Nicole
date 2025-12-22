import { adminAuth, adminDb } from './firebaseAdmin';

export default async function updateUser(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado: Token não fornecido.' });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const requestingUid = decodedToken.uid;

        // CORRIGIDO: Verifica a role de admin no documento do usuário no Firestore.
        const userProfileDoc = await adminDb.collection('users').doc(requestingUid).get();
        if (!userProfileDoc.exists || !userProfileDoc.data().roles?.includes('admin')) {
            return res.status(403).json({ error: 'Acesso negado: Requer privilégios de administrador.' });
        }

        const { uid, roles } = req.body;
        if (!uid || !Array.isArray(roles)) {
            return res.status(400).json({ error: 'UID do usuário e um array de roles são obrigatórios.' });
        }

        // CORRIGIDO: Atualiza as roles no documento do usuário no Firestore.
        await adminDb.collection('users').doc(uid).set({ roles }, { merge: true });

        // Opcional, mas recomendado: Sincroniza as roles para as custom claims do Auth.
        // Isso permite que regras de segurança do Firestore/Storage usem `request.auth.token.roles`.
        await adminAuth.setCustomUserClaims(uid, { roles });

        return res.status(200).json({ message: `As regras do usuário ${uid} foram atualizadas com sucesso.` });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({ error: 'Falha ao atualizar usuário no servidor.', details: error.message });
    }
}
