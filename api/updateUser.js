
import admin from 'firebase-admin';

// A única inicialização garante que não haja múltiplas instâncias.
const initializeAdmin = () => {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin SDK:", error);
      // Lança um erro customizado para ser pego no handler principal
      throw new Error("Server configuration error.");
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', ['POST']).json({ error: 'Method Not Allowed' });
  }

  try {
    initializeAdmin();

    // 1. Autenticação e Autorização do Admin
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden: User is not an admin.' });
    }

    // 2. Validação do Corpo da Requisição
    const { uid, ...dataToUpdate } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'Bad Request: User UID is required.' });
    }

    // 3. Lógica de Atualização
    // Prepara os dados para o serviço de Autenticação do Firebase
    const authUpdatePayload = {};
    if (dataToUpdate.displayName !== undefined) authUpdatePayload.displayName = dataToUpdate.displayName;
    if (dataToUpdate.email !== undefined) authUpdatePayload.email = dataToUpdate.email;
    if (dataToUpdate.disabled !== undefined) authUpdatePayload.disabled = dataToUpdate.disabled;

    // Atualiza no serviço de Autenticação se houver dados
    if (Object.keys(authUpdatePayload).length > 0) {
      await admin.auth().updateUser(uid, authUpdatePayload);
    }
    
    // Define as permissões personalizadas (custom claims) se fornecidas
    if (dataToUpdate.roles !== undefined) {
      await admin.auth().setCustomUserClaims(uid, { roles: dataToUpdate.roles });
    }

    // Atualiza o documento no Firestore para manter a consistência
    await admin.firestore().collection('users').doc(uid).update(dataToUpdate);

    // 4. Resposta de Sucesso
    return res.status(200).json({ success: true, message: 'User updated successfully.' });

  } catch (error) {
    console.error('Error in /api/updateUser handler:', error);

    // Tratamento de erros específicos do Firebase Auth
    if (error.code?.startsWith('auth/')) {
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(401).json({ error: `Unauthorized: ${error.message}` });
    }
    
    // Tratamento de erro de configuração do servidor
    if (error.message === "Server configuration error.") {
        return res.status(500).json({ error: 'Server configuration error. Check Firebase credentials.' });
    }

    // Erro genérico do servidor
    return res.status(500).json({ error: 'Internal Server Error.', details: error.message });
  }
}
