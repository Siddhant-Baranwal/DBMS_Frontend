import React from 'react'
import axiosInstance from '../../api/axiosInstance'
import Error from './Error';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const response = await axiosInstance.get('/logout');
      if (response.status === 200) {
        navigate('/login');
      }
      else {
        Error('Logout failed. Please try again.');
      }
    }
    catch (err) {
      Error('Internal server error');
    }
  }

  return (
    <button className='logout' onClick={logoutHandler}>&#8617;</button>
  )
}
