import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Valida se todas as variáveis necessárias existem.
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('As variáveis de ambiente FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY são obrigatórias.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // O Vercel pode remover as quebras de linha. O .replace garante que elas existam.
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n'),
      })
    });

  } catch (error) {
    console.error('ERRO CRÍTICO AO INICIALIZAR FIREBASE ADMIN:', error.message);
    console.error('Por favor, verifique se as três variáveis de ambiente (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) estão corretas na Vercel.');
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { admin, adminAuth, adminDb };
