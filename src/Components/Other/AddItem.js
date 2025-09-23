// Page 8
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AddItem() {

  useEffect(() => {
    document.title = 'Add item';
  }, []);


  const [form, setForm] = useState({
    name: 'Glucon-D',
    weight: '100gm',
    mrp: 50,
    price: 45.84,
    stock: 0,
    company: 'General',
    tax: 0
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post('/items', form);
    window.close();
    console.log(res);
  }

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}))
  }

  return (
    <div className='page-container animate-fade-in'>
      <h1 className='page-title'>Add a New Item</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <div className='form-group'>
          <label className='form-label'>Product name:</label>
          <input name='name' value={form.name} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Weight with unit:</label>
          <input name='weight' value={form.weight} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>MRP:</label>
          <input name='mrp' type='number' value={form.mrp} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Selling price:</label>
          <input name='price' type='number' value={form.price} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Available quantity:</label>
          <input name='stock' type='number' value={form.stock} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Company:</label>
          <input name='company' value={form.company} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Tax rate:</label>
          <input name='tax' type='number' value={form.tax} onChange={changeHandler} className='form-input'></input>
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}