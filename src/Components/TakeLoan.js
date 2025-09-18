import React, { useState } from 'react'

export default function GiveLoan() {
  const suppliers = ['ABS1242', 'ABC234', 'TE241532', 'GWEE234'];
  const [currentSuppliers, setCurrentSuppliers] = useState(suppliers);
  const today = new Date();
  const [form, setForm] = useState({
    gst: '',
    rate: 5,
    amount: 10000,
    borrow_day: today.getDate(),
    borrow_month: today.getMonth() + 1,
    borrow_year: today.getFullYear(),
    duration_day: 365
  });

  const [showDropdown, setShowDropdown] = useState(true);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'gst') {
      const q = (value || '').toUpperCase();
      const filt = suppliers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentSuppliers(filt);
      const exactMatch = suppliers.some((s) => s.toUpperCase() === q);
      setShowDropdown(!exactMatch);
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const selectHandler = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, gst: value }));
    if (suppliers.includes(value)) setShowDropdown(false);
  };

  return (
    <div>
      <h1 class='title'>Take a new loan.</h1>
      <form onSubmit={submitHandler} >
        <div>
          <p>Supplier GST: </p>
          <input name='gst' value={form.gst} onChange={changeHandler} ></input>
          {showDropdown && (
            <select size={1 + currentSuppliers.length} onChange={selectHandler} >
              <option value=''>--Choose a value--</option>
              {currentSuppliers.map((item, index) => {
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })}
            </select>
          )}
          {showDropdown && (
            <a href='/add/supplier' target='_blank' class='addbutton'>+</a>
          )}
        </div>
        <div>
          <p>Rate: </p>
          <input name='rate' type='number' value={form.rate} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Amount: </p>
          <input name='amount' type='number' value={form.amount} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Borrow date: </p>
          <input name='borrow_month' type='number' value={form.borrow_month} onChange={changeHandler} ></input>
          <p>/</p>
          <input name='borrow_day' type='number' value={form.borrow_day} onChange={changeHandler} ></input>
          <p>/</p>
          <input name='borrow_year' type='number' value={form.borrow_year} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Duration in days: </p>
          <input name='duration_day' type='number' value={form.duration_day} onChange={changeHandler} ></input>
        </div>
        <button disabled={showDropdown} type='submit'>Submit</button>
      </form>
    </div>
  )
}
