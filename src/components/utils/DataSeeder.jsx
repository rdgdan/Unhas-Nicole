import React, { useState } from 'react';
import { db } from '../../firebase'; // Adjusted import path for firebase
import { collection, doc, writeBatch } from 'firebase/firestore';

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

const DataSeeder = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Clique no botão para iniciar.');

    const handleSeed = async () => {
        setLoading(true);
        setMessage('Processando... Aguarde. O lote de dados está sendo enviado ao Firestore.');

        const batch = writeBatch(db);
        const categoriesCollection = collection(db, 'service_categories');
        const servicesCollection = collection(db, 'services');

        try {
            console.log("Iniciando o processo de popular o banco de dados...");
            serviceData.forEach(item => {
                const categoryRef = doc(categoriesCollection);
                batch.set(categoryRef, { name: item.category });

                item.services.forEach(service => {
                    const serviceRef = doc(servicesCollection);
                    batch.set(serviceRef, {
                        ...service,
                        categoryId: categoryRef.id,
                    });
                });
            });

            await batch.commit();
            console.log("Sucesso! O banco de dados foi populado.");
            setMessage('Sucesso! O banco de dados foi populado. Já pode testar o modal. Depois eu removerei este componente.');
        } catch (error) {
            console.error("Erro ao popular o banco de dados:", error);
            setMessage(`Falha ao popular o banco de dados: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', margin: '20px auto', border: '2px dashed #8a6de9', borderRadius: '10px', textAlign: 'center', backgroundColor: '#2c2c3e', maxWidth: '600px', color: '#e0e0e0' }}>
            <h2>Ferramenta Temporária</h2>
            <p style={{marginBottom: '20px'}}>Clique no botão abaixo para adicionar as categorias e serviços de Nail Design ao seu banco de dados.</p>
            <button onClick={handleSeed} disabled={loading} style={{ 
                padding: '12px 25px', 
                fontSize: '1em', 
                cursor: 'pointer',
                backgroundColor: loading ? '#4a4a60' : '#6a4ded',
                color: 'white',
                border: 'none',
                borderRadius: '8px'
            }}>
                {loading ? 'Processando...' : 'Popular Dados de Serviço'}
            </button>
            {message && <p style={{ marginTop: '20px', fontStyle: 'italic' }}>{message}</p>}
        </div>
    );
};

export default DataSeeder;
