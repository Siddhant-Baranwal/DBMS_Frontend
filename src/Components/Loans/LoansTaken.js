import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import Error from '../Other/Error'

export default function LoansTaken() {
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    document.title = 'Loans taken'
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get('/loanstaken/all')
      setLoans(res.data || [])
    } catch (err) {
      console.error(err);
      Error('Could not load loans database');
    } finally {
      setIsLoading(false)
    }
  }

  const orderByDate = () => {
    setLoans((prev) =>
      [...prev].sort((a, b) => new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day))
    )
  }

  const orderByGST = () => {
    setLoans((prev) => [...prev].sort((a, b) => a.gstNumber.localeCompare(b.gstNumber)))
  }

  const reloadHandler = async () => { await fetchLoans() }

  const openDeleteConfirm = (id, gstNumber) => {
    setDeleteCandidate({ id, gstNumber })
    setShowConfirm(true)
  }

  const closeConfirm = () => {
    if (deleting) return
    setShowConfirm(false)
    setDeleteCandidate(null)
  }

  const confirmDelete = async () => {
    if (!deleteCandidate) return
    setDeleting(true)
    try {
      await axiosInstance.delete(`/loanstaken/del/${deleteCandidate.gstNumber}/${deleteCandidate.id}`)
      await fetchLoans()
    } catch (err) {
      console.error(err);
      Error('Could not delete loan due to server error');
    } finally {
      setDeleting(false)
      setShowConfirm(false)
      setDeleteCandidate(null)
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Loans taken</h1>
        <Link to="/" className="btn btn-secondary">Home</Link>
      </div>

      <div className="action-bar" style={{ alignItems: 'center' }}>
        <button onClick={orderByDate} className="btn btn-secondary">Order by date</button>
        <button onClick={orderByGST} className="btn btn-secondary">Order by supplier</button>
        <button onClick={reloadHandler} className="btn btn-secondary">Reload</button>
        <Link to="/add/loanstaken" className="btn btn-primary">Take a new loan</Link>
      </div>

      <div className="table-wrapper" style={{ marginTop: '1rem' }}>
        <table className="data-table">
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
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem' }}>Loading...</td>
              </tr>
            ) : loans.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '1.5rem' }}>No loans found.</td>
              </tr>
            ) : (
              loans.map((item) => (
                <tr key={item.id ?? `${item.gstNumber}-${item.day}-${item.month}-${item.year}`}>
                  <td>{item.gstNumber}</td>
                  <td>{item.rate}</td>
                  <td>{item.amt}</td>
                  <td>{item.day}/{item.month}/{item.year}</td>
                  <td>{item.duration}</td>
                  <td>
                    <button className="btn-icon btn-delete" onClick={() => openDeleteConfirm(item.id, item.gstNumber)} title="Delete" aria-label={`Delete loan ${item.id}`}>
                      &#128465;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showConfirm && deleteCandidate && (
        <div className="modal-overlay" onMouseDown={closeConfirm} role="dialog" aria-modal="true">
          <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm deletion</h3>
              <button onClick={closeConfirm} className="btn-icon" aria-label="Close" disabled={deleting}>&times;</button>
            </div>

            <p style={{ margin: '0.25rem 0 1rem', color: 'var(--text-secondary, #6b7280)' }}>
              Are you sure you want to delete the loan for <strong>{deleteCandidate.gstNumber}</strong> (id: <strong>{deleteCandidate.id}</strong>)? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={closeConfirm} className="btn btn-secondary" disabled={deleting}>Cancel</button>
              <button type="button" onClick={confirmDelete} className="btn btn-danger" disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
