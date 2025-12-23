import { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { uid, isAdmin } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID is required' });
  }

  try {
    // Define o custom claim 'admin' para o usuário
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });
    
    // Retorna uma resposta de sucesso
    return res.status(200).json({ message: `User ${uid} has been ${isAdmin ? 'promoted' : 'demoted'}.` });
  } catch (error) {
    console.error('Error updating user claims:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
