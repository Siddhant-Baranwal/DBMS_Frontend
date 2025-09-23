// Page 4
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function SupplyBill() {
  
  useEffect(() => {
    document.title = 'Invoice details';
  }, []);
  
  const {id} = useParams();
  
  // main state
  const [suppliers, setSuppliers] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const today = new Date();
  const [form, setForm] = useState({  
    provider: '',
    order_day: today.getDate(),
    order_month: today.getMonth(),
    order_year: today.getFullYear(),
    carrier: '',
    bill_number: id,
  })
  
  const [currentSuppliers, setCurrentSuppliers] = useState(suppliers);
  const [currentDrivers, setCurrentDrivers] = useState(carriers);
  const [showDropdownSuppliers, setShowDropdownSuppliers] = useState(true);
  const [showDropdownDrivers, setShowDropdownDrivers] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    
    async function loadAll() {
      document.title = 'Invoice details';
      try {
        const resSuppliers = await axiosInstance.get('/suppliers/all-gst', { params: { id } });
        const suppliersData = Array.isArray(resSuppliers.data) ? resSuppliers.data : [];
        if (mounted) {
          setSuppliers(suppliersData);
          setCurrentSuppliers(suppliersData);
        }
        console.log('Suppliers:', suppliersData);
      } catch (err) {
        console.error('failed to fetch suppliers', err);
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
        const resBill = await axiosInstance.get(`/purchase-book/${id}`);
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
  
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post('/purchase-book', form);
    console.log(res);
    navigate(`/purchase/items/${id}`);
  }
  
  const changeHandler = (e) => {
    const {name, value, type} = e.target;
    if (name === 'provider') {
      const q = (value || '').toUpperCase();
      const filt = suppliers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentSuppliers(filt);
      const exactMatch = suppliers.some((s) => s.toUpperCase() === q);
      setShowDropdownSuppliers(!exactMatch);
    }
    if (name === 'carrier') {
      const q = (value || '').toUpperCase();
      const filt = carriers.filter((item) => item.toUpperCase().startsWith(q));
      setCurrentDrivers(filt);
      const exactMatch = carriers.some((d) => d.toUpperCase() === q);
      setShowDropdownDrivers(!exactMatch);
    }
    setForm(prev => ({
      ...prev, [name]: type==='number' ? Number(value) : value
    }));
  }
  
  const selectHandlerSupplier = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, provider: value }));
    if (suppliers.includes(value)) setShowDropdownSuppliers(false);
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
    <Link to="/purchase" className="btn btn-secondary">Back</Link>
    </div>
    <form onSubmit={submitHandler} className='form-container'>
    <div className='form-group'>
    <label className='form-label'>Bill Number:</label>
    <input name='bill_number' type='number' value={form.bill_number} readOnly onChange={changeHandler} className='form-input'></input>
    </div>
    <div className='form-group'>
    <label className='form-label'>Supplier GST:</label>
    <div className='input-with-select'>
    <input name='provider' value={form.provider} onChange={changeHandler} className='form-input'></input>
    {showDropdownSuppliers && (
      <div className='dropdown-wrapper'>
      <select size={1 + currentSuppliers.length} onChange={selectHandlerSupplier} className='dropdown-select'>
      <option value=''>--Choose a value--</option>
      {currentSuppliers.map((item, index) => {
        return(
          <option key={index} value={item}>{item}</option>
        )
      })}
      </select>
      <a href='/add/supplier' target='_blank' className='btn-icon btn-add'>+</a>
      </div>
    )}
    </div>
    </div>
    <div className='form-group'>
    <label className='form-label'>Order Date:</label>
    <div className='date-group'>
    <input name='order_day' type='number' value={form.order_day} onChange={changeHandler} className='form-input-date'></input>
    <p>/</p>
    <input name='order_month' type='number' value={form.order_month} onChange={changeHandler} className='form-input-date'></input>
    <p>/</p>
    <input name='order_year' type='number' value={form.order_year} onChange={changeHandler} className='form-input-date year'></input>
    </div>
    </div>
    <div className='form-group'>
    <label className='form-label'>Driver license:</label>
    <div className='input-with-select'>
    <input name='carrier' value={form.carrier} onChange={changeHandler} className='form-input'></input>
    {showDropdownDrivers && (
      <div className='dropdown-wrapper'>
      <select size={1 + currentDrivers.length} onChange={selectHandlerDriver} className='dropdown-select'>
      <option value=''>--Choose a value--</option>
      {currentDrivers.map((item, index) => {
        return(
          <option key={index} value={item}>{item}</option>
        )
      })}
      </select>
      <a href='/add/driver' target='_blank' className='btn-icon btn-add'>+</a>
      </div>
    )}
    </div>
    </div>
    <button type='submit' disabled={
      !(suppliers.includes(form.provider) && carriers.includes(form.carrier))
    } className='btn btn-primary'>Next</button>
    </form>
    </div>
  )
}