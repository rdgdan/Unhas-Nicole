import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

    const goToNextPage = () => {
        if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const goToPrevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }

    // Lógica para não gerar centenas de botões de página se a lista for enorme
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

    let pagesToShow = pageNumbers;
    if (nPages > 7) { // Define um limite para exibir os números de página
        let start = Math.max(1, currentPage - 3);
        let end = Math.min(nPages, currentPage + 3);

        if (currentPage < 5) {
            end = 7;
        }
        if (currentPage > nPages - 4) {
            start = nPages - 6;
        }
        pagesToShow = pageNumbers.slice(start - 1, end);
    }

    return (
        <nav className="pagination-nav">
            <ul className='pagination-list'>
                <li className="pagination-item">
                    <button 
                        className={`prev-next-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={goToPrevPage} 
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} /> Anterior
                    </button>
                </li>
                {nPages > 7 && currentPage > 4 && (
                    <>
                        <li className="pagination-item"><button onClick={() => setCurrentPage(1)}>1</button></li>
                        <li className="pagination-item"><span className="ellipsis">...</span></li>
                    </>
                )}
                {pagesToShow.map(pgNumber => (
                    <li key={pgNumber} className={`pagination-item ${currentPage == pgNumber ? 'active' : ''} `} >
                        <button onClick={() => setCurrentPage(pgNumber)}>
                            {pgNumber}
                        </button>
                    </li>
                ))}
                {nPages > 7 && currentPage < nPages - 3 && (
                    <>
                        <li className="pagination-item"><span className="ellipsis">...</span></li>
                        <li className="pagination-item"><button onClick={() => setCurrentPage(nPages)}>{nPages}</button></li>
                    </>
                )}
                <li className="pagination-item">
                     <button 
                        className={`prev-next-btn ${currentPage === nPages ? 'disabled' : ''}`}
                        onClick={goToNextPage} 
                        disabled={currentPage === nPages}
                    >
                        Próximo <ChevronRight size={18} />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination
