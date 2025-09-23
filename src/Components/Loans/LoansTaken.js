import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function LoansTaken() {

  const [loans, setLoans] = useState([]);

  useEffect(() => {
    document.title = 'Loans taken';

    const fetchLoans = async () => {
      try {
        const res = await axiosInstance.get('/loanstaken/all');
        setLoans(res.data);
      } catch (err) {
        console.error('Failed to fetch loans:', err);
      }
    };

    fetchLoans();
  }, []);

  const orderByDate = () => {
    setLoans(prev =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1, a.day);
        const dateB = new Date(b.year, b.month - 1, b.day);
        return dateA - dateB;
      })
    );
  };

  const orderByGST = () => {
    setLoans(prev =>
      [...prev].sort((a, b) => a.gstNumber.localeCompare(b.gstNumber))
    );
  };

  const reloadHandler = async () => {
    try {
      const res = await axiosInstance.get('/loanstaken/all');
      setLoans(res.data);
    } catch (err) {
      console.error('Failed to reload loans:', err);
    }
  };

  const deleteHandler = async (id, gst) => {
    try {
      await axiosInstance.delete(`/loanstaken/${id}/${gst}`);
      setLoans(prev => prev.filter(loan => !(loan.Id === id && loan.gstNumber === gst)));
    } catch (err) {
      console.error('Failed to delete loan:', err);
    }
  };

  return (
    <div className='page-container animate-fade-in'>
      <div className="page-header">
        <h1 className="page-title">Loans taken</h1>
        <Link to="/" className="btn btn-secondary">Home</Link>
      </div>
      <div className='action-bar'>
        <button onClick={orderByDate} className='btn btn-secondary'>Order by date</button>
        <button onClick={orderByGST} className='btn btn-secondary'>Order by supplier</button>
        <button onClick={reloadHandler} className='btn btn-secondary'>Reload</button>
        <a href='/add/loanstaken' target='_blank' className='btn btn-primary'>Take a new loan</a>
      </div>
      <div className='table-wrapper'>
        <table className='data-table'>
          <thead>
            <tr>
              <th>Supplier GST</th>
              <th>Interest rate</th>
              <th>Amount</th>
              <th>Borrow date</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loans.map((item, index) => (
              <tr key={index}>
                <td>{item.gstNumber}</td>
                <td>{item.rate}</td>
                <td>{item.amt}</td>
                <td>{item.day}/{item.month}/{item.year}</td>
                <td>{item.duration}</td>
                <td>
                  <button className='btn-icon btn-delete' onClick={() => deleteHandler(item.Id, item.gstNumber)}>
                    &#128465;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
