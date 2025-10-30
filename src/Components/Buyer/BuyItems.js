// BuyItems.js
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { usePDF } from 'react-to-pdf'

const SUPPLIER_NAME = 'Gagan Traders'
const SUPPLIER_GST = '09BFHPB6043M1ZA'

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
  const [billInfo, setBillInfo] = useState({})
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('items')

  // usePDF hook — the tag we print will be whatever targetRef points at
  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${id}.pdf`
  })

  useEffect(() => {
    document.title = 'Invoice list'
    fetchItems()
    fetchBillInfo()
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

  const fetchBillInfo = async () => {
    try {
      const res = await axiosInstance.get(`/sales-book/${id}`)
      if (res && res.data) setBillInfo(res.data)
    } catch (err) {
      console.error('Failed to fetch bill info', err)
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
      // refresh items after delete
      await fetchItems()
      // refresh all items list too (optional)
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

  // total calculation (numeric and safe)
  const totalAmount = items.reduce((sum, each) => {
    const price = Number(each.price) || 0
    const qty = Number(each.quantity) || 0
    const disc = Number(each.discount) || 0
    const gross = price * qty
    const net = (gross * (100 - disc)) / 100
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
      // refresh items and allItems after add
      await fetchItems()
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

  // wrap toPDF with indicator
  const handleDownloadPDF = async () => {
    try {
      setPdfGenerating(true)
      const res = toPDF()
      if (res && typeof res.then === 'function') await res
    } catch (err) {
      console.error('PDF generation failed', err)
      alert('Failed to generate PDF. See console for details.')
    } finally {
      setPdfGenerating(false)
    }
  }

  const formatDate = () => {
    if (billInfo.order_day && billInfo.order_month && billInfo.order_year) {
      return `${billInfo.order_day}/${billInfo.order_month}/${billInfo.order_year}`
    }
    return ''
  }

  // Tab content renderers
  const renderItemsTab = () => (
    <div className="animate-fade-in">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Company</th>
              <th>MRP</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Disc %</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="10" className="placeholder-text">
                  No items added yet.
                </td>
              </tr>
            ) : (
              items.map((each, idx) => (
                <tr key={each.id ?? idx}>
                  <td>{idx + 1}</td>
                  <td>{each.name}</td>
                  <td>{each.weight}</td>
                  <td>{each.company}</td>
                  <td>{each.mrp}</td>
                  <td>{each.price}</td>
                  <td>{each.quantity}</td>
                  <td>{each.discount}</td>
                  <td>
                    {(
                      ((Number(each.price) || 0) *
                        (Number(each.quantity) || 0) *
                        (100 - (Number(each.discount) || 0))) /
                      100
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteHandler(each.id, each.name)}
                      className="btn-icon btn-delete"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="total-summary">Total: {totalAmount.toFixed(2)}</div>
    </div>
  )

  const renderAddTab = () => (
    <div className="animate-fade-in add-item-section">
      <div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">Search item by name</label>
          <input
            className="form-input"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Type item name"
          />
        </div>

        <div className="table-wrapper" style={{ maxHeight: 320, overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Weight</th>
                <th>Company</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it, idx) => (
                <tr
                  key={it.id ?? idx}
                  className="table-row-hover"
                  onClick={() => onSelectItem(it)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{idx + 1}</td>
                  <td>{it.name}</td>
                  <td>{it.weight}</td>
                  <td>{it.company}</td>
                  <td>{it.c_price}</td>
                  <td>{it.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="selected-item-card">
        {selectedItem ? (
          <>
            <div className="selected-item-title">
              {selectedItem.name} ({selectedItem.weight})
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                className="form-input"
                type="number"
                min={1}
                value={selQuantity}
                onChange={(e) => setSelQuantity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount (%)</label>
              <input
                className="form-input"
                type="number"
                min={0}
                max={100}
                value={selDiscount}
                onChange={(e) => setSelDiscount(e.target.value)}
              />
            </div>

            <div className="action-bar" style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={onAddClick}>
                Add
              </button>
              <button className="btn btn-secondary" onClick={fetchAllItems}>
                Reload Items
              </button>
            </div>
          </>
        ) : (
          <div className="placeholder-text">No item selected</div>
        )}

        <a href="/add/item" target="_blank" rel="noreferrer" className="btn-link" style={{ marginTop: 12 }}>
          Add New Item to Database
        </a>
      </div>
    </div>
  )

  const renderPreviewTab = () => (
    <div className="animate-fade-in preview-wrapper">
      <div ref={targetRef} className="invoice-box" aria-label="Printable invoice" style={{padding: '32px'}}>
        <div className="invoice-top" style={{display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div className="supplier" style={{ fontWeight: 800, fontSize: 18 }}>
              {SUPPLIER_NAME}
            </div>
            <div style={{ marginTop: 6 }}>GST: {SUPPLIER_GST}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div>
              <strong>Invoice #:</strong> {billInfo.bill_number ?? id}
            </div>
            <div>
              <strong>Buyer:</strong> {billInfo.customer ?? '-'}
            </div>
            <div>
              <strong>Date:</strong> {formatDate() || '-'}
            </div>
            <div>
              <strong>Driver:</strong> {billInfo.carrier ?? '-'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Weight</th>
                <th>Company</th>
                <th style={{ textAlign: 'right' }}>MRP</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'center' }}>Disc %</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="9" className="placeholder-text">
                    No items added yet.
                  </td>
                </tr>
              ) : (
                items.map((it, idx) => {
                  const price = Number(it.price) || 0
                  const qty = Number(it.quantity) || 0
                  const disc = Number(it.discount) || 0
                  const total = (price * qty * (100 - disc)) / 100
                  return (
                    <tr key={it.id ?? idx}>
                      <td>{idx + 1}</td>
                      <td>{it.name}</td>
                      <td>{it.weight}</td>
                      <td>{it.company}</td>
                      <td style={{ textAlign: 'right' }}>{it.mrp}</td>
                      <td style={{ textAlign: 'right' }}>{price.toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>{qty}</td>
                      <td style={{ textAlign: 'center' }}>{disc}</td>
                      <td style={{ textAlign: 'right' }}>{total.toFixed(2)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="total-summary" style={{ marginTop: 12 }}>
          Total: {totalAmount.toFixed(2)}
        </div>
      </div>

      <div className="action-bar" style={{ justifyContent: 'center'}}>
        <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={pdfGenerating}>
          {pdfGenerating ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Invoice #{id}</h1>
        <Link to="/sales" className="btn btn-secondary">
          Save
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="action-bar" style={{ justifyContent: 'center', marginBottom: 16 }}>
        {['items', 'add', 'preview'].map((tab) => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
            style={{ minWidth: 120 }}
          >
            {tab === 'items' ? 'Items' : tab === 'add' ? 'Add / Search' : 'Print Preview'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'items' && renderItemsTab()}
      {activeTab === 'add' && renderAddTab()}
      {activeTab === 'preview' && renderPreviewTab()}

      {/* Delete Modal */}
      {showConfirm && deleteCandidate && (
        <div className="modal-overlay" onMouseDown={closeConfirm}>
          <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Confirm deletion</h2>
              <button onClick={closeConfirm} className="btn-icon">
                &times;
              </button>
            </div>

            <div style={{ marginBottom: 12 }}>
              Are you sure you want to delete <strong>{deleteCandidate.name}</strong> from this bill? This action cannot be undone.
            </div>

            <div className="action-bar" style={{ justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeConfirm} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
