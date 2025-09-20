// Page 8
import React, { useState } from 'react'

export default function AddItem() {

  const [form, setForm] = useState({
    name: 'Glucon-D',
    weight: '100gm',
    mrp: 50,
    price: 45.84,
    stock: 0,
    company: 'General',
    tax: 0
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
      <h1>Add a new item.</h1>
      <form onSubmit={submitHandler} >
        <div>
          <p>Product name: </p>
          <input name='name' value={form.name} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Weight with unit: </p>
          <input name='weight' value={form.weight} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>MRP: </p>
          <input name='mrp' type='number' value={form.mrp} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Selling price: </p>
          <input name='price' type='number' value={form.price} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Available quantity: </p>
          <input name='stock' type='number' value={form.stock} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Company: </p>
          <input name='company' value={form.company} onChange={changeHandler} ></input>
        </div>
        <div>
          <p>Tax rate: </p>
          <input name='tax' type='number' value={form.tax} onChange={changeHandler} ></input>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
