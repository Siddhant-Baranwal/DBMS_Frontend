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
    <div>
      <h1>Add a new driver.</h1>
      <form onSubmit={submitHandler} >
        <div>
          <p>First name: </p>
          <input name='fname' value={form.fname} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Last name: </p>
          <input name='lname' value={form.lname} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Phone number: </p>
          <input name='phone' value={form.phone} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Aadhar number: </p>
          <input name='aadhar' value={form.aadhar} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>DL number: </p>
          <input name='license' value={form.license} onChange={changeHandler} ></input>
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
          <p>Locality: </p>
          <input name='locality' value={form.locality} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>House number: </p>
          <input name='house' value={form.house} onChange={changeHandler} ></input>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
