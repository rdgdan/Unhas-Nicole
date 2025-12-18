/* globals process */
/**
 * SCRIPT DE USO ÚNICO PARA POPULAR O BANCO DE DADOS
 * 
 * Para executar:
 * 1. Certifique-se de ter as dependências instaladas (`npm install`)
 * 2. Execute o comando no terminal: node scripts/seedDatabase.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';

// Cole aqui a configuração do seu Firebase que está em src/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCPTpuOWymGBVbFrjfWaBh5GA-g_RjzsGM",
  authDomain: "celtic-shape-454100-b1.firebaseapp.com",
  projectId: "celtic-shape-454100-b1",
  storageBucket: "celtic-shape-454100-b1.appspot.com",
  messagingSenderId: "670359528005",
  appId: "1:670359528005:web:d0d51f460ac51e4269792c"
};

// A lista de serviços que você aprovou
const serviceData = [
    { category: "Manicure", services: [
        { name: "Manicure Tradicional (Esmaltação clássica)", price: 30.00 },
        { name: "Manicure com Esmaltação em Gel", price: 50.00 },
        { name: "Cutilagem & Lixamento (Preparo sem esmalte)", price: 20.00 }
    ]},
    { category: "Pedicure", services: [
        { name: "Pedicure Tradicional (Esmaltação clássica)", price: 40.00 },
        { name: "Pedicure com Esmaltação em Gel", price: 60.00 },
        { name: "Spa dos Pés (Esfoliação e hidratação profunda)", price: 50.00 }
    ]},
    { category: "Alongamentos", services: [
        { name: "Aplicação de Fibra de Vidro", price: 200.00 },
        { name: "Aplicação de Gel na Tip", price: 180.00 },
        { name: "Blindagem ou Banho de Gel (em unhas naturais)", price: 90.00 }
    ]},
    { category: "Manutenção de Alongamentos", services: [
        { name: "Manutenção de Fibra de Vidro (até 21 dias)", price: 100.00 },
        { name: "Manutenção de Gel (até 21 dias)", price: 90.00 }
    ]},
    { category: "Arte & Decoração (Adicionais)", services: [
        { name: "Decoração Encapsulada (por unha)", price: 15.00 },
        { name: "Decoração Simples (Ex: fitilho, glitter em 2 unhas)", price: 10.00 },
        { name: "Francesinha Tradicional ou Reversa", price: 5.00 }
    ]},
    { category: "Reparos & Remoção", services: [
        { name: "Remoção Completa de Alongamento", price: 50.00 },
        { name: "Reparo ou Troca de uma unha (fora da manutenção)", price: 25.00 }
    ]}
];

// Inicializa o app e o firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedDatabase = async () => {
    console.log('Iniciando o processo para popular o banco de dados...');

    const batch = writeBatch(db);
    const categoriesCollection = collection(db, 'service_categories');
    const servicesCollection = collection(db, 'services');

    try {
        serviceData.forEach(item => {
            const categoryRef = doc(categoriesCollection); // Gera um ID único para a categoria
            batch.set(categoryRef, { name: item.category });

            item.services.forEach(service => {
                const serviceRef = doc(servicesCollection); // Gera um ID único para o serviço
                // Adiciona o serviço com uma referência ao ID da sua categoria
                batch.set(serviceRef, {
                    ...service,
                    categoryId: categoryRef.id, // << A LIGAÇÃO ENTRE SERVIÇO E CATEGORIA
                });
            });
        });

        await batch.commit();
        console.log('\n\u001b[32mSUCESSO!\u001b[0m O banco de dados foi populado com as categorias e serviços.');
        console.log('O modal de agendamento já deve funcionar corretamente com a seleção de classes e subclasses.');
        console.log('Este script não precisa ser executado novamente.');

    } catch (error) {
        console.error('\n\u001b[31mERRO:\u001b[0m Falha ao popular o banco de dados:', error);
    } finally {
        // Encerra o processo para que o terminal seja liberado
        process.exit(0);
    }
};

seedDatabase();
