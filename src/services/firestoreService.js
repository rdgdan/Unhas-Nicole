
import { db, auth } from '../firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, where, query, setDoc, getDoc } from 'firebase/firestore';

// --- Coleções ---
const schedulesCollection = collection(db, 'schedules');
const servicesCollection = collection(db, 'services');
const clientsCollection = collection(db, 'clients');
const usersCollection = collection(db, 'users');

// --- Helper para obter o token de autenticação ---
const getIdToken = async () => {
    if (!auth.currentUser) {
        throw new Error("Nenhum usuário autenticado. Faça login novamente.");
    }
    return await auth.currentUser.getIdToken(true);
}

// --- Funções de Perfil de Usuário e Permissões (Admin) ---

export const getAllUsers = async () => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// CORREÇÃO: Função robusta para deletar usuário com catch limpo
export const deleteUserAccount = async (uid) => {
    const token = await getIdToken();
    const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
    });

    if (!response.ok) {
        try {
            const errorResult = await response.json();
            throw new Error(errorResult.error || `Erro do servidor: ${response.statusText}`);
        } catch {
            throw new Error(`Falha ao deletar usuário. Status: ${response.status} ${response.statusText}`);
        }
    }
    
    try {
        return await response.json();
    } catch {
        return { success: true }; // Retorna sucesso se não houver corpo
    }
};

// CORREÇÃO: Função robusta para atualizar usuário com catch limpo
export const updateUserDetails = async (uid, dataToUpdate) => {
    const token = await getIdToken();
    const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid, ...dataToUpdate })
    });

    if (!response.ok) {
        try {
            const errorResult = await response.json();
            throw new Error(errorResult.error || `Erro do servidor: ${response.statusText}`);
        } catch {
            throw new Error(`Falha ao atualizar usuário. Status: ${response.status} ${response.statusText}`);
        }
    }

    try {
        return await response.json();
    } catch {
        return { success: true }; // Retorna sucesso se não houver corpo
    }
};


// --- Funções de Perfil de Usuário (Padrão) ---

export const createUserProfile = (userId, profileData) => {
    return setDoc(doc(db, 'users', userId), { ...profileData, createdAt: Timestamp.now() });
};

export const getUserProfile = (userId) => {
    return getDoc(doc(db, 'users', userId));
}

// --- Funções de Agendamento (Schedules) --- //
export const getSchedules = async (userId) => {
    const q = query(schedulesCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), start: doc.data().start?.toDate(), end: doc.data().end?.toDate() }));
};

export const addSchedule = (schedule) => addDoc(schedulesCollection, { ...schedule, start: Timestamp.fromDate(new Date(schedule.start)), end: Timestamp.fromDate(new Date(schedule.end)) });
export const updateSchedule = (id, schedule) => updateDoc(doc(db, 'schedules', id), { ...schedule, ...(schedule.start && { start: Timestamp.fromDate(new Date(schedule.start)) }), ...(schedule.end && { end: Timestamp.fromDate(new Date(schedule.end)) }) });
export const deleteSchedule = (id) => deleteDoc(doc(db, 'schedules', id));

// --- Funções de Serviços (Services) --- //
export const getServices = async (userId) => {
    const q = query(servicesCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addService = (service) => addDoc(servicesCollection, { ...service, createdAt: Timestamp.now() });
export const updateService = (id, serviceData) => updateDoc(doc(db, 'services', id), serviceData);
export const deleteService = (id) => deleteDoc(doc(db, 'services', id));

// --- Funções de Clientes (Clients) --- //
export const getClients = async (userId) => {
    const q = query(clientsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addClient = (client) => addDoc(clientsCollection, { ...client, createdAt: Timestamp.now() });
export const updateClient = (id, clientData) => updateDoc(doc(db, 'clients', id), clientData);
export const deleteClient = (id) => deleteDoc(doc(db, 'clients', id));

// --- FUNÇÃO DE MIGRAÇÃO DE DADOS ---
export const migrateDataToUser = async (userId) => {
    if (!userId) throw new Error("UserID é necessário para a migração.");

    const migrateCollection = async (coll, type) => {
        const q = query(coll, where("userId", "==", null));
        const snapshot = await getDocs(q);
        const promises = [];
        snapshot.forEach(document => {
            const docRef = doc(db, type, document.id);
            promises.push(updateDoc(docRef, { userId: userId }));
        });
        await Promise.all(promises);
        return snapshot.size;
    };

    const migratedClients = await migrateCollection(clientsCollection, 'clients');
    const migratedServices = await migrateCollection(servicesCollection, 'services');

    return { migratedClients, migratedServices };
};
