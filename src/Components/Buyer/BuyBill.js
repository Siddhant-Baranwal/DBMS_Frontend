// Page 13
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function BuyBill() {
  const {id} = useParams();
  const buyers = ['ABETR2414', 'BWRS32452', 'BGSTEG4235', 'OHNF12343', 'IUMEA3524'];
  const drivers = ['ChintuLal', 'RamPrasad', 'KalluRam', 'MakhanchuLal', 'MunnaSeth'];
  const today = new Date();
  const [form, setForm] = useState({
    gst: '',
    order_day: today.getDate(),
    order_month: today.getMonth(),
    order_year: today.getFullYear(),
    driver: '',
    bill: id,
  })

  const [currentBuyers, setCurrentBuyers] = useState(buyers);
  const [currentDrivers, setCurrentDrivers] = useState(drivers);
  const [showDropdownBuyers, setShowDropdownBuyers] = useState(true);
  const [showDropdownDrivers, setShowDropdownDrivers] = useState(true);
  
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(form);
    navigate(`/sales/items/${id}`);
  }

  const changeHandler = (e) => {
    const {name, value, type} = e.target;
    if (name === 'gst') {
      const q = (value || '').toUpperCase();
      const filt = buyers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentBuyers(filt);
      const exactMatch = buyers.some((s) => s.toUpperCase() === q);
      setShowDropdownBuyers(!exactMatch);
    }
    if (name === 'driver') {
      const q = (value || '').toUpperCase();
      const filt = drivers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentDrivers(filt);
      const exactMatch = drivers.some((d) => d.toUpperCase() === q);
      setShowDropdownDrivers(!exactMatch);
    }
    setForm(prev => ({
      ...prev, [name]: type==='number' ? Number(value) : value
    }));
  }

  const selectHandlerBuyer = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, gst: value }));
    if (buyers.includes(value)) setShowDropdownBuyers(false);
  };

  const selectHandlerDriver = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, driver: value }));
    if (drivers.includes(value)) setShowDropdownDrivers(false);
  };

  return (
    <div>
      <h1 class='title'>Bill details</h1>
      <form onSubmit={submitHandler}>
        <div>
          <p>Bill number: </p>
          <input name='bill' type='number' value={form.bill} readOnly onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Buyer GST: </p>
          <input name='gst' value={form.gst} onChange={changeHandler} ></input>
          {showDropdownBuyers && (
            <select size={1 + currentBuyers.length} onChange={selectHandlerBuyer} >
              <option value=''>--Choose a value--</option>
              {currentBuyers.map((item, index) => {
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })}
            </select>
          )}
          {showDropdownBuyers && (
            <a href='/add/buyer' target='_blank' class='addbutton'>+</a>
          )}
        </div>
        <div>
          <p>Order date: </p>
          <input name='order_day' type='number' value={form.order_day} onChange={changeHandler} ></input>
          <p>/</p>
          <input name='order_month' type='number' value={form.order_month} onChange={changeHandler} ></input>
          <p>/</p>
          <input name='order_year' type='number' value={form.order_year} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Driver license: </p>
          <input name='driver' value={form.driver} onChange={changeHandler} ></input>
          {showDropdownDrivers && (
            <select size={1 + currentDrivers.length} onChange={selectHandlerDriver} >
              <option value=''>--Choose a value--</option>
              {currentDrivers.map((item, index) => {
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })}
            </select>
          )}
          {showDropdownDrivers && (
            <a href='/add/driver' target='_blank' class='addbutton'>+</a>
          )}
        </div>
        <button type='submit' disabled={
          !(buyers.includes(form.gst) && drivers.includes(form.driver))
        }>Next</button>
      </form>
    </div>
  )
}
