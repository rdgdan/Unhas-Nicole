import { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      isAdmin: !!userRecord.customClaims?.admin,
    }));
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
