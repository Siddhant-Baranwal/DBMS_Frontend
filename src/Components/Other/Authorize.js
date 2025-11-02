import React from 'react'
import axiosInstance from '../../api/axiosInstance'

export default async function Authorize() {
  try {
    const response = await axiosInstance.get('/authorize');
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
