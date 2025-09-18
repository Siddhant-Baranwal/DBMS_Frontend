// Page 15
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function BuyBill() {
  const {id} = useParams();
  const suppliers = ['ABETR2414', 'BWRS32452', 'BGSTEG4235', 'OHNF12343', 'IUMEA3524'];
  const drivers = ['ChintuLal', 'RamPrasad', 'KalluRam', 'MakhanchuLal', 'MunnaSeth'];
  const today = new Date();
  const [form, setForm] = useState({
    gst: '',
    order_day: today.getDate(),
    order_month: today.getMonth(),
    order_year: today.getFullYear(),
    driver: '',
    bill: id,
    amount: 0
  })

  const [currentSuppliers, setCurrentSuppliers] = useState(suppliers);
  const [currentDrivers, setCurrentDrivers] = useState(drivers);
  const [showDropdownSuppliers, setShowDropdownSuppliers] = useState(true);
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
      const filt = suppliers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentSuppliers(filt);
      const exactMatch = suppliers.some((s) => s.toUpperCase() === q);
      setShowDropdownSuppliers(!exactMatch);
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

  const selectHandlerSupplier = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, gst: value }));
    if (suppliers.includes(value)) setShowDropdownSuppliers(false);
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
          <p>Supplier GST: </p>
          <input name='gst' value={form.gst} onChange={changeHandler} ></input>
          {showDropdownSuppliers && (
            <select size={1 + currentSuppliers.length} onChange={selectHandlerSupplier} >
              <option value=''>--Choose a value--</option>
              {currentSuppliers.map((item, index) => {
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })}
            </select>
          )}
          {showDropdownSuppliers && (
            <a href='/add/supplier' target='_blank' class='addbutton'>+</a>
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
        <div>
          <p>Total amount: </p>
          <input name='amount' type='number' value={form.amount} readOnly onChange={changeHandler} ></input>
        </div>
        <button type='submit' disabled={
          !(suppliers.includes(form.gst) && drivers.includes(form.driver))
        }>Next</button>
      </form>
    </div>
  )
}
