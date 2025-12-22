import { adminAuth, adminDb } from './firebaseAdmin';

export default async function getUsers(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado: Token não fornecido.' });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // CORRIGIDO: Verifica a role de admin no documento do usuário no Firestore.
        const userProfileDoc = await adminDb.collection('users').doc(uid).get();

        if (!userProfileDoc.exists) {
            return res.status(403).json({ error: 'Acesso negado: Perfil de usuário não encontrado.' });
        }

        const userProfile = userProfileDoc.data();
        if (!userProfile.roles?.includes('admin')) {
            return res.status(403).json({ error: 'Acesso negado: Requer privilégios de administrador.' });
        }

        // Se for admin, continua para listar os usuários do Firebase Auth.
        const listUsersResult = await adminAuth.listUsers(1000);
        const authUsers = listUsersResult.users;

        // Busca os perfis no Firestore para enriquecer os dados com as roles corretas.
        const profilesSnapshot = await adminDb.collection('users').get();
        const profilesMap = new Map();
        profilesSnapshot.forEach(doc => {
            profilesMap.set(doc.id, doc.data());
        });

        // Combina os dados do Auth com os perfis do Firestore.
        const users = authUsers.map(user => {
            const profile = profilesMap.get(user.uid);
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || profile?.displayName,
                photoURL: user.photoURL || profile?.photoURL,
                disabled: user.disabled,
                roles: profile?.roles || [], // Usa as roles do Firestore como fonte da verdade.
            };
        });

        return res.status(200).json(users);

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        // Adiciona um log mais detalhado do erro no servidor
        return res.status(500).json({ error: 'Falha ao buscar usuários no servidor.', details: error.message });
    }
}
