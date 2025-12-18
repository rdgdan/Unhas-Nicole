import { db } from '../firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, where, query, setDoc, getDoc } from 'firebase/firestore';

// --- Collections ---
const schedulesCollection = collection(db, 'schedules');
const servicesCollection = collection(db, 'services');
const clientsCollection = collection(db, 'clients');
const usersCollection = collection(db, 'users');

// --- Funções de Perfil de Usuário e Permissões ---

// Cria um perfil para o usuário no Firestore (agora com roles opcionais)
export const createUserProfile = (userId, email, roles = []) => {
    const userDocRef = doc(db, 'users', userId);
    return setDoc(userDocRef, { 
        email: email, 
        roles: roles, // Usa as roles fornecidas, ou um array vazio por padrão
        createdAt: Timestamp.now()
    });
};

// Busca o perfil (e as roles) de um usuário específico
export const getUserProfile = (userId) => {
    const userDocRef = doc(db, 'users', userId);
    return getDoc(userDocRef); // Use getDoc para um único documento
}

// Lista todos os usuários para a página de admin
export const getAllUsers = async () => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Permite que um admin atualize as roles de outro usuário
export const updateUserRoles = (userId, roles) => {
    const userDocRef = doc(db, 'users', userId);
    return updateDoc(userDocRef, { roles: roles });
};

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

// --- FUNÇÃO DE MIGRAÇÃO DE DADOS (CORRIGIDA) ---
export const migrateDataToUser = async (userId) => {
    if (!userId) throw new Error("UserID é necessário para a migração.");

    const migrateCollection = async (coll, type) => {
        const q = query(coll, where("userId", "==", null)); // Migra apenas docs sem userId
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