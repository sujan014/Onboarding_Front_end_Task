import './PaginationComponent.css';
import { useState } from 'react';

const PaginationRender = ({ pageCount, currentPage, onPageChange}) => {
    const pageNumbers = [];
    const [display, setDisplay] = useState(false);
    
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(i);
    }
    const onPageChangeEvent = (event) => {
      onPageChange(event.target.value);
    }    
  
    return (
      <div id="wrapper">
        <select value={currentPage} onChange={onPageChangeEvent}  className='dropdown'>
          {pageNumbers.map( (number) => (
            <option key={number}>
              {number}
            </option>
          ))}        
        </select>        
      </div>
    );
  };

  export {PaginationRender};