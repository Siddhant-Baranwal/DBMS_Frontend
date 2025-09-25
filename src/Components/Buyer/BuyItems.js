import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function BuyItems() {
  const { id } = useParams()
  const [allItems, setAllItems] = useState([])
  const [items, setItems] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selQuantity, setSelQuantity] = useState(1)
  const [selDiscount, setSelDiscount] = useState(0)

  useEffect(() => {
    document.title = 'Invoice list'
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(response.data) ? response.data : [])
      const res = await axiosInstance.get(`/saleslist/all/${id}`)
      const curItems = Array.isArray(res.data)
        ? res.data.map((element) => ({
            name: element[0],
            weight: element[1],
            company: element[2],
            mrp: element[3],
            price: element[4],
            quantity: element[5],
            discount: element[6],
            id: element[7]
          }))
        : []
      setItems(curItems)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAllItems = async () => {
    try {
      const res = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error(error)
    }
  }

  const openDeleteConfirm = (itemId, name) => {
    setDeleteCandidate({ itemId, name })
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
      await axiosInstance.delete(`/saleslist/delete/${id}/${deleteCandidate.itemId}`)
      const response = await axiosInstance.get(`/saleslist/all/${id}`)
      const curItems = Array.isArray(response.data)
        ? response.data.map((element) => ({
            name: element[0],
            weight: element[1],
            company: element[2],
            mrp: element[3],
            price: element[4],
            quantity: element[5],
            discount: element[6],
            id: element[7]
          }))
        : []
      setItems(curItems)
      const result = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(result.data) ? result.data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
      setShowConfirm(false)
      setDeleteCandidate(null)
    }
  }

  const deleteHandler = (itemid, name) => {
    openDeleteConfirm(itemid, name)
  }

  const totalAmount = items.reduce((sum, each) => {
    const gross = each.price * each.quantity
    const net = gross * (100 - each.discount) / 100
    return sum + net
  }, 0)

  useEffect(() => {
    const q = (searchName || '').trim().toLowerCase()
    if (q === '') setFilteredItems(allItems)
    else setFilteredItems(allItems.filter((it) => it.name.toLowerCase().startsWith(q)))
  }, [searchName, allItems])

  const onSelectItem = (it) => {
    setSelectedItem(it)
    setSelQuantity(1)
    setSelDiscount(0)
  }

  const onAddClick = async () => {
    if (!selectedItem) return
    setSelectedItem(null)
    setSearchName('')
    const req = {
      bill_number: id,
      item_id: selectedItem.id,
      discount: Number(selDiscount),
      quantity: Number(selQuantity)
    }
    try {
      await axiosInstance.post('/saleslist/add', req)
      const response = await axiosInstance.get(`/saleslist/all/${id}`)
      const curItems = Array.isArray(response.data)
        ? response.data.map((element) => ({
            name: element[0],
            weight: element[1],
            company: element[2],
            mrp: element[3],
            price: element[4],
            quantity: element[5],
            discount: element[6],
            id: element[7]
          }))
        : []
      setItems(curItems)
      const result = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(result.data) ? result.data : [])
    } catch (err) {
      if (err.response) {
        if (err.response.status === 500) alert('Not enough stock available.')
        else alert(`Server error: ${err.response.status} - ${err.response.data?.message || ''}`)
      }
      console.error(err)
    }
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Bill {id}:</h1>
        <Link to="/sales" className="btn btn-secondary">Save</Link>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.I.</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Company</th>
              <th>MRP</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '1.25rem' }}>No items added yet.</td>
              </tr>
            ) : (
              items.map((each, index) => (
                <tr key={each.id ?? index}>
                  <td>{index + 1}</td>
                  <td>{each.name}</td>
                  <td>{each.weight}</td>
                  <td>{each.company}</td>
                  <td>{each.mrp}</td>
                  <td>{each.price}</td>
                  <td>{each.quantity}</td>
                  <td>{each.discount}</td>
                  <td>{(each.quantity * each.price * (100 - each.discount) / 100).toFixed(2)}</td>
                  <td>
                    <button className="btn-icon btn-delete" onClick={() => deleteHandler(each.id, each.name)} title="Delete" aria-label={`Delete item ${each.name}`}>
                      &#128465;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="total-summary">Total: {totalAmount.toFixed(2)}</h2>

      <div className="add-item-section">
        <div className="search-and-select">
          <div className="form-group">
            <label className="form-label">Search item by name:</label>
            <input className="form-input" name="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Type item name" />
          </div>

          <div className="table-wrapper search-results">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Weight</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>MRP</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((it, idx) => (
                  <tr key={it.id ?? idx} onClick={() => onSelectItem(it)} className={`table-row-hover ${it.stock === 0 ? 'row-red' : ''}`}>
                    <td>{idx + 1}</td>
                    <td>{it.name}</td>
                    <td>{it.weight}</td>
                    <td>{it.company}</td>
                    <td>{it.c_price}</td>
                    <td>{it.stock}</td>
                    <td>{it.mrp}</td>
                    <td>{it.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="selected-item-card">
          {selectedItem ? (
            <div>
              <p className="selected-item-title">Selected: {selectedItem.name} ({selectedItem.weight})</p>

              <div className="form-group">
                <label className="form-label">Quantity:</label>
                <input className="form-input" name="selQuantity" type="number" min="1" value={selQuantity} onChange={(e) => setSelQuantity(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Discount (%): </label>
                <input className="form-input" name="selDiscount" type="number" min="0" max="100" value={selDiscount} onChange={(e) => setSelDiscount(e.target.value)} />
              </div>

              <div className="action-bar">
                <button type="button" onClick={onAddClick} className="btn btn-primary">Add</button>
              </div>
            </div>
          ) : (
            <p className="placeholder-text">No item selected</p>
          )}
          <div className="action-buttons">
            <a href="/add/item" target="_blank" rel="noreferrer" className="btn-link">Add New Item to Database</a>
            <button type="button" className="btn btn-secondary" onClick={fetchAllItems} style={{ marginLeft: '30px' }}>Reload</button>
          </div>
        </div>
      </div>

      {showConfirm && deleteCandidate && (
        <div className="modal-overlay" onMouseDown={closeConfirm} role="dialog" aria-modal="true">
          <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm deletion</h3>
              <button onClick={closeConfirm} className="btn-icon" aria-label="Close" disabled={deleting}>&times;</button>
            </div>

            <p style={{ margin: '0.25rem 0 1rem', color: 'var(--text-secondary, #6b7280)' }}>
              Are you sure you want to delete <strong>{deleteCandidate.name}</strong> from this bill? This action cannot be undone.
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
