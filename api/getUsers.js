import { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Pega o token do cabeçalho da requisição
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // 2. Verifica se o token é válido e se pertence a um administrador
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Forbidden: User is not an admin' });
    }

    // 3. Se for admin, lista os usuários
    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      isAdmin: !!userRecord.customClaims?.admin,
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error in /api/getUsers:', error);

    // Retorna um erro específico se for um problema de autenticação
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
        return res.status(401).json({ error: `Unauthorized: ${error.message}` });
    }

    // Erro genérico para outras falhas (incluindo a falha de inicialização do Admin)
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
