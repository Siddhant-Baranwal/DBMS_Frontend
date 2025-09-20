// Page 15
import React, { useState } from 'react'

export default function AddBuyer() {

  const [form, setForm] = useState({
    name: 'test name',
    email: 'test@email',
    phone: 'test phone',
    gst: 'test gst',
    city: 'test city',
    zip: 'test zip',
    area: 'test area',
    building: 'test building'
  })

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(form);
  }

  const changeHandler = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  return (
    <div className='page-container animate-fade-in'>
      <h1 className='page-title'>Add a New Buyer</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <div className='form-group'>
          <label className='form-label'>Name of the firm:</label>
          <input name='name' value={form.name} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Email address:</label>
          <input name='email' type='email' value={form.email} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Phone number:</label>
          <input name='phone' value={form.phone} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>GST number:</label>
          <input name='gst' value={form.gst} onChange={changeHandler} className='form-input'></input>
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
          <label className='form-label'>Area:</label>
          <input name='area' value={form.area} onChange={changeHandler} className='form-input'></input>
        </div>
        <div className='form-group'>
          <label className='form-label'>Building number:</label>
          <input name='building' value={form.building} onChange={changeHandler} className='form-input'></input>
        </div>
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}