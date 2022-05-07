import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { Prompt, useParams, useNavigate } from "react-router-dom";
import { db } from '../../firebase'
import { ref, onValue } from 'firebase/database'

import "./paging.css";

const Paging = (c) => {
  const navigate = useNavigate()
  const [isBlocking, setIsBlocking] = useState(true)
  const { state } = useParams()
  const category = c.category
  const [curListObj, setCurListObj] = useState({
    current_uid: 'Unknown',
    list_id: null,
    list_name: 'Unknown',
    housing: 'Unknown',
    switches: 'Unknown',
    keycaps: 'Unknown',
    pcb: 'Unknown',
    plate: 'Unknown',
    stabs: 'Unknown'
  })

  const renderData = (data) => {
    return (
      <tbody>
        <tr key='names' className="column-name">
          <td className="item-image"></td>
          <td className="item-name">Product Name</td>
          {category.includes('Housing') ? (<td className="item-size">Size</td>):(<></>)}
          {(category.includes('Keycaps') || category.includes('Plate') || category.includes('Housing')) ? (<td className="item-material">Material</td>):(<></>)}
          {category.includes('Switches') ? (<td className="item-type">Type</td>):(<></>)}
          <td className="item-price">Price</td>
          <td className="item-add-button">
            
          </td>
        </tr>
        {data}
      </tbody>
    )
  }

  const listObtained = useRef(false)
  if ((state != null) && !listObtained.current) {
    setCurListObj(JSON.parse(state))
    listObtained.current = true
  }

  const [data, setData] = useState([])

  const [curPage, setCurPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [maxPagesToDisplay] = useState(10)
  const [maxPerPage, setMaxPerPage] = useState(10)
  const [minPerPage, setMinPerPage] = useState(0)

  const firstUpdate = useRef(true)

  const makeSpecificPartComponent = (p, index) => {
    var tempList = curListObj
    switch(category) {
      case 'Housing/':
        tempList.housing=p.product_name
        break;
      case 'Switches/':
        tempList.switches=p.product_name
        break;
      case 'Keycaps/':
        tempList.keycaps=p.product_name
        break;
      case 'PCB/':
        tempList.pcb=p.product_name
        break;
      case 'Plate/':
        tempList.plate=p.product_name
        break;
      case 'Stabilizers/':
        tempList.stabs=p.product_name
        break;
      default:
        break;
    }
    var link = '/list-maker/' + JSON.stringify(tempList)
    const newTo = {
      pathname: link,
      category,
    }
    return (
      <tr key={index} className="list-item">
        <td className="item-image"><img src={p.img_url} alt={p.product_name}/></td>
        <td className="item-name"><a href={p.link}>{p.product_name}</a></td>
        {category.includes('Housing') ? (<td className="item-size">{p.size}</td>):(<></>)}
        {(category.includes('Keycaps') || category.includes('Plate') || category.includes('Housing')) ? (<td className="item-material">{p.material}</td>):(<></>)}
        {category.includes('Switches') ? (<td className="item-type">{p.type}</td>):(<></>)}
        <td className="item-price">{Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(p.product_price)}</td>
        <td className="item-add-button">
          <button className="add-item-button" onMouseDown={() => handleAccessPagination()} onMouseUp={() => handleGoToPagination(newTo)} onMouseLeave={() => handleSussyMouseMovement()} >Add</button>
        </td>
      </tr>
    )
  }

  const handleSussyMouseMovement = () => setIsBlocking(true)
  const handleAccessPagination = () => setIsBlocking(false)
  const handleGoToPagination = (newTo) => {
    navigate(newTo)
    setIsBlocking(true)
  }

  const getDataFromDatabase = async() => {
    const list_ref = ref(db, category)
    await onValue(list_ref, (snapshot) => {
      let index = 0
      snapshot.forEach(function(childSnapshot) {
        let child = childSnapshot.val()
        let temp = makeSpecificPartComponent(child, index)
        index++
        
        setData(old =>[...old, temp])
        
      })
    })
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
      window.history.replaceState(null, '',  "/"+category.toLowerCase())
      return
    }
  })

  useEffect(() => {
    getDataFromDatabase()
  }, [])

  return (
    <>
    { !!state ? <Prompt when={isBlocking} message="Are you sure you want to leave? Any unsaved progress will be lost!" />: <></>}
    <div className="paging-container">
    {firstUpdate.current ? (<p>Loading...</p>):(
      <>
        <h1>{c.category.split('/')[0]}</h1> <br />
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