// Page 6
import React, { useState } from 'react'

export default function AddSupplier() {

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
    setForm(prev => ({...prev, [name]: value}))
  }

  return (
    <div>
      <h1>Add a new supplier.</h1>
      <form onSubmit={submitHandler} >
        <div>
          <p>Name of the firm: </p>
          <input name='name' value={form.name} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Email address: </p>
          <input name='email' type='email' value={form.email} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Phone number: </p>
          <input name='phone' value={form.phone} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>GST number: </p>
          <input name='gst' value={form.gst} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>City: </p>
          <input name='city' value={form.city} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Zip code: </p>
          <input name='zip' value={form.zip} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Area: </p>
          <input name='area' value={form.area} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Building number: </p>
          <input name='building' value={form.building} onChange={changeHandler} ></input>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
