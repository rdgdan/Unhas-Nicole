import admin from 'firebase-admin';

// Evita reinicializações desnecessárias em ambientes serverless.
if (!admin.apps.length) {
  try {
    // Verifica se as três variáveis de ambiente obrigatórias estão definidas.
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('As variáveis de ambiente FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY são obrigatórias.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Este é o método padrão para formatar a chave privada a partir de uma variável de ambiente.
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });

  } catch (error) {
    // Log de erro detalhado para facilitar a depuração nos logs da Vercel.
    console.error('ERRO CRÍTICO AO INICIALIZAR FIREBASE ADMIN:', error.message);
    if (error.message.includes('PEM')) {
        console.error('CAUSA PROVÁVEL: O valor da variável FIREBASE_PRIVATE_KEY na Vercel está mal formatado. Por favor, verifique se o valor foi copiado corretamente do arquivo JSON.');
    }
  }
}

// Exporta as instâncias do Admin SDK.
const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { admin, adminAuth, adminDb };
