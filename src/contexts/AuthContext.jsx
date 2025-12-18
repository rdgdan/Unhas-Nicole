import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    createUserProfile,
    getUserProfile as getUserProfileFromFirestore,
    updateUserRoles
} from '../services/firestoreService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = "teste@gmail.com";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Usuário logado: buscar sempre o perfil mais recente.
                const userDoc = await getUserProfileFromFirestore(user.uid);
                const isDesignatedAdmin = user.email === ADMIN_EMAIL;

                let profileData = null;

                if (userDoc.exists()) {
                    // Perfil existe no Firestore.
                    profileData = { ...userDoc.data(), id: user.uid };

                    // LÓGICA DE CORREÇÃO E GARANTIA DE ADMIN
                    // Se for o admin e a role não estiver no perfil, adiciona.
                    if (isDesignatedAdmin && !profileData.roles?.includes('admin')) {
                        await updateUserRoles(user.uid, ['admin']);
                        // Atualiza o objeto local para refletir a mudança imediatamente
                        profileData.roles = ['admin'];
                    }
                } else {
                    // Primeiro login/registro: Perfil não existe, então o criamos.
                    const initialRoles = isDesignatedAdmin ? ['admin'] : [];
                    const newProfile = {
                        email: user.email,
                        roles: initialRoles,
                        createdAt: new Date(),
                    };
                    await createUserProfile(user.uid, newProfile.email, newProfile.roles);
                    profileData = { ...newProfile, id: user.uid };
                }
                setUserProfile(profileData);
                setCurrentUser(user);
            } else {
                // Usuário deslogado: limpa os perfis.
                setUserProfile(null);
                setCurrentUser(null);
            }
            // Finaliza o loading APENAS depois de todas as operações assíncronas.
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const hasRole = (role) => {
        return userProfile?.roles?.includes(role) ?? false;
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        hasRole,
    };

    // ####### A CORREÇÃO FUNDAMENTAL #######
    // Removemos a lógica `!loading && children`.
    // O provedor agora renderiza os filhos IMEDIATAMENTE.
    // Os componentes filhos (`AdminRoute`, `PrivateRoute`) usarão o estado `loading`
    // para decidir se mostram uma tela de carregamento ou o conteúdo.
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
