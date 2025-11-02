import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import Error from './Error'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Login';
    const logoutbutton = document.querySelector('.logout');
    if (logoutbutton) {
      logoutbutton.style.display = 'none';
    }
    return () => {
      if (logoutbutton) {
        logoutbutton.style.display = 'block';
      }
    };
  }, [])

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post('/login', form)
      if (response.status === 200) {
        navigate('/');
      }
      else {
        Error('Invalid credentials');
      }
    } catch (err) {
      Error('Internal server error');
    }
  }

  const changeHandler = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Login</h1>
      <form onSubmit={submitHandler} className="form-container">
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input name="username" value={form.username} onChange={changeHandler} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input name="password" type='password' value={form.password} onChange={changeHandler} className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
