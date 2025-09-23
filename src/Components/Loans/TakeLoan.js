import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function TakeLoan() {
  const [suppliers, setSuppliers] = useState([]);
  const [currentSuppliers, setCurrentSuppliers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(true);

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

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Take loan';

    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get('/suppliers/all-gst');
        const gstList = Array.isArray(res.data) ? res.data : [];
        setSuppliers(gstList);
        setCurrentSuppliers(gstList);
      } catch (err) {
        console.error('Failed to fetch suppliers:', err);
      }
    };

    fetchSuppliers();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/loanstaken', {
        rate: form.rate,
        amt: form.amount,
        day: form.borrow_day,
        month: form.borrow_month,
        year: form.borrow_year,
        duration: form.duration_day,
        gstNumber: form.gst
      });
      navigate('/loans/taken');
    } catch (err) {
      console.error('Failed to submit loan:', err);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === 'gst') {
      const q = (value || '').toUpperCase();
      const filtered = suppliers.filter(gst => gst.toUpperCase().startsWith(q));
      setCurrentSuppliers(filtered);
      const exactMatch = suppliers.some(gst => gst.toUpperCase() === q);
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
    <div className='page-container animate-fade-in'>
      <div className="page-header">
        <h1 className="page-title">Take a new loan</h1>
        <Link to="/loans/taken" className="btn btn-secondary">Back</Link>
      </div>
      <form onSubmit={submitHandler} className='form-container'>
        <div className='form-group'>
          <label className='form-label'>Supplier GST:</label>
          <div className='input-with-select'>
            <input
              name='gst'
              value={form.gst}
              onChange={changeHandler}
              className='form-input'
            />
            {showDropdown && currentSuppliers.length > 0 && (
              <div className='dropdown-wrapper'>
                <select
                  size={1 + currentSuppliers.length}
                  onChange={selectHandler}
                  className='dropdown-select'
                >
                  <option value=''>--Choose a supplier--</option>
                  {currentSuppliers.map((gst, index) => (
                    <option key={index} value={gst}>{gst}</option>
                  ))}
                </select>
                <a href='/add/supplier' target='_blank' className='btn-icon btn-add'>+</a>
              </div>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label className='form-label'>Rate:</label>
          <input
            name='rate'
            type='number'
            value={form.rate}
            onChange={changeHandler}
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>Amount:</label>
          <input
            name='amount'
            type='number'
            value={form.amount}
            onChange={changeHandler}
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>Borrow date:</label>
          <div className='date-group'>
            <input
              name='borrow_month'
              type='number'
              value={form.borrow_month}
              onChange={changeHandler}
              className='form-input-date'
            />
            <p>/</p>
            <input
              name='borrow_day'
              type='number'
              value={form.borrow_day}
              onChange={changeHandler}
              className='form-input-date'
            />
            <p>/</p>
            <input
              name='borrow_year'
              type='number'
              value={form.borrow_year}
              onChange={changeHandler}
              className='form-input-date year'
            />
          </div>
        </div>

        <div className='form-group'>
          <label className='form-label'>Duration in days:</label>
          <input
            name='duration_day'
            type='number'
            value={form.duration_day}
            onChange={changeHandler}
            className='form-input'
          />
        </div>

        <button disabled={showDropdown} type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
}
