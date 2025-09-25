import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function LoansGiven() {
  const [loans, setLoans] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    document.title = 'Loans given'
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.get('/loansgiven/all')
      setLoans(res.data || [])
    } catch (err) {
      console.error(err)
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
    setLoans((prev) => [...prev].sort((a, b) => (a.gstNumber || '').localeCompare(b.gstNumber || '')))
  }

  const reloadHandler = async () => { await fetchLoans() }

  const openDeleteConfirm = (item) => {
    const id = item.id ?? item.Id ?? item.ID ?? item.loanId ?? null
    const gstNumber = item.gstNumber ?? item.gst ?? item.GST ?? ''
    setDeleteCandidate({ id, gstNumber })
    setShowConfirm(true)
  }

  const closeConfirm = () => {
    if (deleting) return
    setShowConfirm(false)
    setDeleteCandidate(null)
  }

  const confirmDelete = async () => {
    if (!deleteCandidate || !deleteCandidate.id) return
    setDeleting(true)
    try {
      const { id, gstNumber } = deleteCandidate
      await axiosInstance.delete(`/loansgiven/del/${encodeURIComponent(gstNumber)}/${encodeURIComponent(id)}`)
      await fetchLoans()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
      setShowConfirm(false)
      setDeleteCandidate(null)
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Loans given</h1>
        <Link to="/" className="btn btn-secondary">Home</Link>
      </div>

      <div className="action-bar" style={{ alignItems: 'center' }}>
        <button onClick={orderByDate} className="btn btn-secondary">Order by date</button>
        <button onClick={orderByGST} className="btn btn-secondary">Order by buyer</button>
        <button onClick={reloadHandler} className="btn btn-secondary">Reload</button>
        <Link to="/add/loansgiven" className="btn btn-primary">Give a new loan</Link>
      </div>

      <div className="table-wrapper" style={{ marginTop: '1rem' }}>
        <table className="data-table">
          <thead className="tablehead">
            <tr>
              <th>Buyer GST</th>
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
              loans.map((item, index) => {
                const key = item.id ?? item.Id ?? `loan-${index}`
                const gst = item.gstNumber ?? item.gst ?? item.GST ?? ''
                const id = item.id ?? item.Id ?? item.ID ?? item.loanId ?? null
                return (
                  <tr key={key}>
                    <td>{gst}</td>
                    <td>{item.rate}</td>
                    <td>{item.amt}</td>
                    <td>{item.day}/{item.month}/{item.year}</td>
                    <td>{item.duration}</td>
                    <td>
                      <button className="btn-icon btn-delete" onClick={() => openDeleteConfirm(item)} title="Delete" aria-label={`Delete loan ${id || index}`}>
                        &#128465;
                      </button>
                    </td>
                  </tr>
                )
              })
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
              Are you sure you want to delete the loan for <strong>{deleteCandidate.gstNumber || '(unknown GST)'}</strong>
              {deleteCandidate.id ? <> (id: <strong>{deleteCandidate.id}</strong>)</> : null}
              ? This action cannot be undone.
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
