// Page 13
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function BuyBill() {
  const { id } = useParams();
  const navigate = useNavigate();

  const today = new Date();

  const [buyers, setBuyers] = useState([]);
  const [carriers, setCarriers] = useState([]);

  const [form, setForm] = useState({
    customer: '',
    order_day: today.getDate(),
    order_month: today.getMonth() + 1,
    order_year: today.getFullYear(),
    carrier: '',
    bill_number: id,
  });

  const [currentBuyers, setCurrentBuyers] = useState([]);
  const [currentDrivers, setCurrentDrivers] = useState([]);
  const [showDropdownBuyers, setShowDropdownBuyers] = useState(true);
  const [showDropdownDrivers, setShowDropdownDrivers] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      document.title = 'Invoice details';
      try {
        const resBuyers = await axiosInstance.get('/buyers/all-gst', { params: { id } });
        const buyersData = Array.isArray(resBuyers.data) ? resBuyers.data : [];
        if (mounted) {
          setBuyers(buyersData);
          setCurrentBuyers(buyersData);
        }
        console.log('buyers:', buyersData);
      } catch (err) {
        console.error('failed to fetch buyers', err);
      }

      try {
        const resDrivers = await axiosInstance.get('/drivers/all-licences');
        const driversData = Array.isArray(resDrivers.data) ? resDrivers.data : [];
        if (mounted) {
          setCarriers(driversData);
          setCurrentDrivers(driversData);
        }
        console.log('carriers:', driversData);
      } catch (err) {
        console.error('failed to fetch drivers', err);
      }

      try {
        const resBill = await axiosInstance.get(`/sales-book/${id}`);
        if (mounted && resBill && resBill.data) {
          setForm(prev => ({ ...prev, ...resBill.data }));
          console.log('Bill details:', resBill.data);
        }
      } catch (err) {
        console.warn('no existing bill or fetch failed:', err);
      }
    }

    loadAll();
    return () => { mounted = false; };
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/sales-book', form);
      console.log('saved:', res);
      navigate(`/sales/items/${id}`);
    } catch (err) {
      console.error('submit error:', err);
    }
  }

  const changeHandler = (e) => {
    const { name, value, type } = e.target;

    if (name === 'customer') {
      const q = (value || '').toUpperCase();
      const filt = buyers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentBuyers(filt);
      const exactMatch = buyers.some((s) => s.toUpperCase() === q);
      setShowDropdownBuyers(!exactMatch);
    }

    if (name === 'carrier') {
      const q = (value || '').toUpperCase();
      const filt = carriers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentDrivers(filt);
      const exactMatch = carriers.some((d) => d.toUpperCase() === q);
      setShowDropdownDrivers(!exactMatch);
    }

    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  }

  const selectHandlerBuyer = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, customer: value }));
    if (buyers.includes(value)) setShowDropdownBuyers(false);
  };

  const selectHandlerDriver = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, carrier: value }));
    if (carriers.includes(value)) setShowDropdownDrivers(false);
  };

  return (
    <div className='page-container animate-fade-in'>
      <div className="page-header">
        <h1 className="page-title">Bill {id}:</h1>
        <Link to="/sales" className="btn btn-secondary">Back</Link>
      </div>

      <form onSubmit={submitHandler} className='form-container'>
        <div className='form-group'>
          <label className='form-label'>Bill Number:</label>
          <input
            name='bill_number'
            type='number'
            value={form.bill_number}
            readOnly
            className='form-input'
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>Buyer GST:</label>
          <div className='input-with-select'>
            <input name='customer' value={form.customer} onChange={changeHandler} className='form-input' />
            {showDropdownBuyers && (
              <div className='dropdown-wrapper'>
                <select size={1 + currentBuyers.length} onChange={selectHandlerBuyer} className='dropdown-select'>
                  <option value=''>--Choose a value--</option>
                  {currentBuyers.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <a href='/add/buyer' target='_blank' rel='noreferrer' className='btn-icon btn-add'>+</a>
              </div>
            )}
          </div>
        </div>

        <div className='form-group'>
          <label className='form-label'>Order Date:</label>
          <div className='date-group'>
            <input name='order_day' type='number' value={form.order_day} onChange={changeHandler} className='form-input-date' />
            <p>/</p>
            <input name='order_month' type='number' value={form.order_month} onChange={changeHandler} className='form-input-date' />
            <p>/</p>
            <input name='order_year' type='number' value={form.order_year} onChange={changeHandler} className='form-input-date year' />
          </div>
        </div>

        <div className='form-group'>
          <label className='form-label'>Driver license:</label>
          <div className='input-with-select'>
            <input name='carrier' value={form.carrier} onChange={changeHandler} className='form-input' />
            {showDropdownDrivers && (
              <div className='dropdown-wrapper'>
                <select size={1 + currentDrivers.length} onChange={selectHandlerDriver} className='dropdown-select'>
                  <option value=''>--Choose a value--</option>
                  {currentDrivers.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <a href='/add/carrier' target='_blank' rel='noreferrer' className='btn-icon btn-add'>+</a>
              </div>
            )}
          </div>
        </div>

        <button
          type='submit'
          disabled={!(currentBuyers.includes(form.customer) && currentDrivers.includes(form.carrier))}
          className='btn btn-primary'
        >
          Next
        </button>
      </form>
    </div>
  );
}
