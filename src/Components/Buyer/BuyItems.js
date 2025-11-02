// BuyItems.js
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { usePDF } from 'react-to-pdf'
import Error from '../Other/Error'

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
  const [mounted, setMounted] = useState(true)

  // usePDF hook — the tag we print will be whatever targetRef points at
  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${id}.pdf`
  })

  useEffect(() => {
    document.title = 'Invoice list'
    setMounted(true)
    fetchItems()
    fetchBill()
    return () => setMounted(false)
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
      Error('Could not load items.')
    }
  }

  const fetchBill = async () => {
    try {
      const res = await axiosInstance.get(`/sales-book/${id}`)
      if (mounted && res && res.data) setBillInfo(res.data)
    } catch (err) {
      console.error('Failed to fetch bill info', err)
      Error('Failed to fetch bill info')
    }
  }

  const fetchAllItems = async () => {
    try {
      const res = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error(error)
      Error('Could not fetch all items.')
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
      Error('Cannot delete due to server error.')
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
        if (err.response.status === 500) Error('Not enough stock available.')
        else Error(`Server error: ${err.response.status} - ${err.response.data?.message || ''}`)
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
      Error('Failed to generate PDF. See console for details.')
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
        <div className="form-group mb-12">
          <label className="form-label">Search item by name</label>
          <input
            className="form-input"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Type item name"
          />
        </div>

        <div className="table-wrapper search-results-max-height">
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
                  className="table-row-hover cursor-pointer"
                  onClick={() => onSelectItem(it)}
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

            <div className="action-bar action-bar-spaced">
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

        <a href="/add/item" target="_blank" rel="noreferrer" className="btn-link btn-link-spaced">
          Add New Item to Database
        </a>
      </div>
    </div>
  )

  const renderPreviewTab = () => (
    <div className="invoice-preview-container">
      <div
        ref={targetRef}
        className="invoice-preview-box"
        aria-label="Printable invoice"
      >
        <div className="invoice-preview-header">
          <div>
            <div className="invoice-preview-title-large">
              {SUPPLIER_NAME}
            </div>
            <div className="invoice-preview-meta">GST: {SUPPLIER_GST}</div>
          </div>

          <div className="invoice-preview-aligned-right">
            <div>
              <span className="invoice-preview-bold">Invoice #:</span> {billInfo.bill_number ?? id}
            </div>
            <div>
              <span className="invoice-preview-bold">Buyer:</span> {billInfo.customer ?? '-'}
            </div>
            <div>
              <span className="invoice-preview-bold">Date:</span> {formatDate() || '-'}
            </div>
            <div>
              <span className="invoice-preview-bold">Driver:</span> {billInfo.carrier ?? '-'}
            </div>
          </div>
        </div>

        <div className="invoice-preview-table-wrapper">
          <table className="invoice-preview-table">
            <thead>
              <tr className="invoice-preview-table-header">
                <th>#</th>
                <th>Name</th>
                <th>Weight</th>
                <th>Company</th>
                <th className="invoice-preview-table-aligned-right">MRP</th>
                <th className="invoice-preview-table-aligned-right">Price</th>
                <th className="invoice-preview-table-aligned-center">Qty</th>
                <th className="invoice-preview-table-aligned-center">Disc %</th>
                <th className="invoice-preview-table-aligned-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="9" className="invoice-preview-empty">
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
                    <tr key={it.id ?? idx} className="invoice-preview-row-border">
                      <td>{idx + 1}</td>
                      <td>{it.name}</td>
                      <td>{it.weight}</td>
                      <td>{it.company}</td>
                      <td className="invoice-preview-table-aligned-right">{it.mrp}</td>
                      <td className="invoice-preview-table-aligned-right">{price.toFixed(2)}</td>
                      <td className="invoice-preview-table-aligned-center">{qty}</td>
                      <td className="invoice-preview-table-aligned-center">{disc}</td>
                      <td className="invoice-preview-table-aligned-right">{total.toFixed(2)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="invoice-preview-total">
          Total: ₹{totalAmount.toFixed(2)}
        </div>
        
        <div className="invoice-preview-signature">
          <div className="invoice-preview-signature-left">Receiver's Signature</div>
          <div className="invoice-preview-signature-right">Supplier's Signature</div>
        </div>

      </div>

      <div className="action-bar action-bar-center mt-16">
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
      <div className="action-bar action-bar-center-top">
        {['items', 'add', 'preview'].map((tab) => (
          <button
            key={tab}
            className={`btn tab-button ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
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

            <div className="mb-12">
              Are you sure you want to delete <strong>{deleteCandidate.name}</strong> from this bill? This action cannot be undone.
            </div>

            <div className="action-bar action-bar-end">
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
