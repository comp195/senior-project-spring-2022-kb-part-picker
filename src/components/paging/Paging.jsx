import React, { useEffect, useState } from "react";
import { db } from '../../firebase'
import { ref, onValue } from 'firebase/database'

import "./paging.css";


const renderData = (data) => {
  return (
    <ul>
      {data.map((l, index) => {
        return <li key={index}>{l}</li>;
      })}
    </ul>
  );
};

const Paging = (category) => {
  const [data, setData] = useState([]);

  const [curPage, setCurPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const getDataFromDatabase = async() => {
    var cat = category.category
    console.log({cat})
    const list_ref = ref(db, cat)
    await onValue(list_ref, (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        setData(old =>[...old, childSnapshot.child('product_name').val()])
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

  const handleLoadMore = () => {
    setItemsPerPage(itemsPerPage + 5);
  };

  return (
    <>
      <h1>Todo List</h1> <br />
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
      <button onClick={handleLoadMore} className="loadmore">
        Load More
      </button>
    </>
  );
}

export default Paging;