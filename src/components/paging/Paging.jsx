import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { db } from '../../firebase'
import { ref, onValue } from 'firebase/database'

import "./paging.css";


const renderData = (data) => {
  return (
    <tbody>
      {data}
    </tbody>
  );
};

const Paging = (category) => {
  const [data, setData] = useState([]);

  const [curPage, setCurPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [pageNumberLimit, setpageNumberLimit] = useState(10);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const firstUpdate = useRef(true)
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
  });
  const getDataFromDatabase = async() => {
    var cat = category.category
    console.log({cat})
    const list_ref = ref(db, cat)
    await onValue(list_ref, (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        let child = childSnapshot.val()
        let temp
        if (cat.includes('Housing')) {
          temp = (
            <tr className="list-item">
              <td className="item-image"><img src={child.img_url} alt={child.product_name}/></td>
              <td className="item-name">{child.product_name}</td>
              <td className="item-size">{child.size}</td>
              <td className="item-price">{child.product_price}</td>
              <td className="item-add-button"><NavLink to ='/list-maker'><button className="add-item-button">Add to List</button></NavLink></td>
            </tr>
          )
        }
        //   switches,
        if (cat.includes('Switches')) {
          temp = (
            <tr className="list-item">
              <td className="item-image"><img src={child.img_url} alt={child.product_name}/></td>
              <td className="item-name">{child.product_name}</td>
              <td className="item-material">{child.material}</td>
              <td className="item-price">{child.product_price}</td>
              <td className="item-add-button"><NavLink to ='/list-maker'><button className="add-item-button">Add to List</button></NavLink></td>
            </tr>
          )
        }
        //   keycap,
        if (cat.includes('Keycaps')) {
          temp = (
            <tr className="list-item">
              <td className="item-image"><img src={child.img_url} alt={child.product_name}/></td>
              <td className="item-name">{child.product_name}</td>
              {/*change to type when ya get there
              <td className="item-material">{kc.material}</td>*/}
              <td className="item-price">{child.product_price}</td>
              <td className="item-add-button"><NavLink to ='/list-maker'><button className="add-item-button">Add to List</button></NavLink></td>
            </tr>
          )
        }
        //   pcb
        if (cat.includes('Housing')) {
          temp = (
            <tr className="list-item">
              <td className="item-image"><img src={child.img_url} alt={child.product_name}/></td>
              <td className="item-name">{child.product_name}</td>
              <td className="item-size">{child.size}</td>
              <td className="item-price">{child.price}</td>
            </tr>
          )
        }
        setData(old =>[...old, temp])
      })
    })
    console.log({data})
  }

  const handleClick = (event) => {
    setCurPage(Number(event.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = curPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={curPage == number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  useEffect(() => {
    getDataFromDatabase()
  }, []);

  const handleNext = () => {
    setCurPage(curPage + 1);

    if (curPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevious = () => {
    setCurPage(curPage - 1);

    if ((curPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  let incrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    incrementBtn = <li onClick={handleNext}> &hellip; </li>;
  }

  let decrementBtn = null;
  if (minPageNumberLimit >= 1) {
    decrementBtn = <li onClick={handlePrevious}> &hellip; </li>;
  }

  return (
    <>
    
    <div className="paging-container">

    {firstUpdate.current ? (<p>Loading...</p>):(
      <>
        <h1>{category.category.split('/')[0]}</h1> <br />
        {renderData(currentItems)}
        <ul className="pageNumbers">
          <li>
            <button
              onClick={handlePrevious}
              disabled={curPage == pages[0] ? true : false}
            >
              Prev
            </button>
          </li>
          {decrementBtn}
          {renderPageNumbers}
          {incrementBtn}

          <li>
            <button
              onClick={handleNext}
              disabled={curPage == pages[pages.length - 1] ? true : false}
            >
              Next
            </button>
          </li>
        </ul>
      </>
    )}

    </div>
    </>
  );
}

export default Paging;