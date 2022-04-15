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
  )
}

const Paging = (category) => {
  const [data, setData] = useState([])

  const [curPage, setCurPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [maxPagesToDisplay, setMaxPagesToDisplay] = useState(10)
  const [maxPerPage, setMaxPerPage] = useState(10)
  const [minPerPage, setMinPerPage] = useState(0)

  const firstUpdate = useRef(true)

  const makeSpecificPartComponent = (p, category, index) => {
    return (
      <tr key={index} className="list-item">
        <td className="item-image"><img src={p.img_url} alt={p.product_name}/></td>
        <td className="item-name"><a href={p.link}>{p.product_name}</a></td>
        {category.includes('Housing') ? (<td className="item-size">{p.size}</td>):(<></>)}
        {category.includes('Keycaps') ? (<td className="item-material">{p.material}</td>):(<></>)}
        {category.includes('Switches') ? (<td className="item-type">{p.type}</td>):(<></>)}
        <td className="item-price">{Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(p.product_price)}</td>
        <td className="item-add-button"><NavLink to ='/list-maker'><button className="add-item-button">Add</button></NavLink></td>
      </tr>
    )
  }

  const getDataFromDatabase = async() => {
    var cat = category.category
    console.log({cat})
    const list_ref = ref(db, cat)
    await onValue(list_ref, (snapshot) => {
      let index = 0
      snapshot.forEach(function(childSnapshot) {
        let child = childSnapshot.val()
        let temp = makeSpecificPartComponent(child, cat, index)
        index++
        
        setData(old =>[...old, temp])
        
      })
    })
    console.log({data})
  }

  const handleClick = (event) => {
    setCurPage(Number(event.target.id))
  }

  const pages = []
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pages.push(i)
  }

  const indexOfLastItem = curPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPerPage + 1 && number > minPerPage) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={curPage === number ? "active" : null}
        >
          {number}
        </li>
      )
    } else {
      return null
    }
  })

  const handleNext = () => {
    setCurPage(curPage + 1);

    if (curPage + 1 > maxPerPage) {
      setMaxPerPage(maxPerPage + maxPagesToDisplay)
      setMinPerPage(minPerPage + maxPagesToDisplay)
    }
  }

  const handlePrevious = () => {
    setCurPage(curPage - 1)

    if ((curPage - 1) % maxPagesToDisplay === 0) {
      setMaxPerPage(maxPerPage - maxPagesToDisplay)
      setMinPerPage(minPerPage - maxPagesToDisplay)
    }
  }

  let incrementBtn = null;
  if (pages.length > maxPerPage) {
    incrementBtn = <li onClick={handleNext}> &hellip; </li>
  }

  let decrementBtn = null;
  if (minPerPage >= 1) {
    decrementBtn = <li onClick={handlePrevious}> &hellip; </li>
  }

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
  })

  useEffect(() => {
    getDataFromDatabase()
  }, [])

  return (
    <>
    
    <div className="paging-container">

    {firstUpdate.current ? (<p>Loading...</p>):(
      <>
        <h1>{category.category.split('/')[0]}</h1> <br />
        <table>
          {renderData(currentItems)}
        </table>
        <ul className="pageNumbers">
          <li>
            <button
              onClick={handlePrevious}
              disabled={curPage === pages[0] ? true : false}
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
              disabled={curPage === pages[pages.length - 1] ? true : false}
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