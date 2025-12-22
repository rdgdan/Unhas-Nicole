import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('As variáveis de ambiente FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY são obrigatórias.');
    }

    // Pega a chave privada da variável de ambiente.
    const privateKeyFromEnv = process.env.FIREBASE_PRIVATE_KEY;

    // TRUQUE FINAL: Força a interpretação correta das quebras de linha (\n)
    // tratando a string como um valor JSON. Isso é muito mais robusto que o .replace().
    const privateKey = JSON.parse(`"${privateKeyFromEnv}"`);

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      })
    });

  } catch (error) {
    console.error('ERRO CRÍTICO AO INICIALIZAR FIREBASE ADMIN:', error.message);
    console.error('Causa provável: A variável FIREBASE_PRIVATE_KEY na Vercel está mal formatada. Verifique se copiou o valor exatamente como no arquivo JSON.');
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { admin, adminAuth, adminDb };
