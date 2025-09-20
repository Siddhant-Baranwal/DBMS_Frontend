// Page 7
import React, { useState } from 'react'

export default function AddDriver() {

  const [form, setForm] = useState({
    fname: 'test fname',
    lname: 'test lname',
    phone: 'test phone',
    aadhar: 'test aadhar',
    license: 'test license',
    city: 'test city',
    zip: 'test zip',
    locality: 'test locality',
    house: 'test house'
  })

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(form);
  }

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}))
  }

  return (
    <div className='page-container animate-fade-in'>
      <h1 className='page-title'>Add a New Driver</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <div className='form-group'>
          <label className='form-label'>First name:</label>
          <input name='fname' value={form.fname} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Last name:</label>
          <input name='lname' value={form.lname} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Phone number:</label>
          <input name='phone' value={form.phone} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Aadhar number:</label>
          <input name='aadhar' value={form.aadhar} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>DL number:</label>
          <input name='license' value={form.license} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>City:</label>
          <input name='city' value={form.city} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Zip code:</label>
          <input name='zip' value={form.zip} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Locality:</label>
          <input name='locality' value={form.locality} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>House number:</label>
          <input name='house' value={form.house} onChange={changeHandler} className='form-input'></input>
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}