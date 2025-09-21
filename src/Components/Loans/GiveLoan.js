// Page 10
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function GiveLoan() {

  useEffect(() => {
    document.title = 'Give loan';
  }, []);

  const buyers = ['ABS1242', 'ABC234', 'TE241532', 'GWEE234'];
  const [currentBuyers, setCurrentBuyers] = useState(buyers);
  const today = new Date();
  const navigate = useNavigate();
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
    navigate('/loans/given');
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name === 'gst') {
      const q = (value || '').toUpperCase();
      const filt = buyers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentBuyers(filt);
      const exactMatch = buyers.some((s) => s.toUpperCase() === q);
      setShowDropdown(!exactMatch);
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const selectHandler = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, gst: value }));
    if (buyers.includes(value)) {
      setShowDropdown(false);
    }
  };

  return (
    <div className='page-container animate-fade-in'>
      <h1 className="page-title">Give a New Loan</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <div className='form-group'>
          <label className='form-label'>Buyer GST:</label>
          <div className='input-with-select'>
              <input name='gst' value={form.gst} onChange={changeHandler} className='form-input'></input>
              {showDropdown && (
                <div className='dropdown-wrapper'>
                    <select size={1 + currentBuyers.length} onChange={selectHandler} className='dropdown-select'>
                      <option value=''>--Choose a value--</option>
                      {currentBuyers.map((item, index) => {
                        return(
                          <option key={index} value={item}>{item}</option>
                        )
                      })}
                    </select>
                    <a href='/add/buyer' target='_blank' className='btn-icon btn-add'>+</a>
                </div>
              )}
          </div>
        </div>
        <div className='form-group'>
          <label className='form-label'>Rate:</label>
          <input name='rate' type='number' value={form.rate} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Amount:</label>
          <input name='amount' type='number' value={form.amount} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Borrow date:</label>
          <div className='date-group'>
              <input name='borrow_month' type='number' value={form.borrow_month} onChange={changeHandler} className='form-input-date'></input>
              <p>/</p>
              <input name='borrow_day' type='number' value={form.borrow_day} onChange={changeHandler} className='form-input-date'></input>
              <p>/</p>
              <input name='borrow_year' type='number' value={form.borrow_year} onChange={changeHandler} className='form-input-date year'></input>
          </div>
        </div>
        <div className='form-group'>
          <label className='form-label'>Duration in days:</label>
          <input name='duration_day' type='number' value={form.duration_day} onChange={changeHandler} className='form-input'></input>
        </div>
        <button disabled={showDropdown} type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}