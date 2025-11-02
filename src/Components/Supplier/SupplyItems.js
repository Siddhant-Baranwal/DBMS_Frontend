import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import Error from '../Other/Error'
import { usePDF } from 'react-to-pdf'

const SUPPLIER_NAME = 'Gagan Traders'
const SUPPLIER_GST = '09BFHPB6043M1ZA'

export default function SupplyItems() {
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
    filename: `purchase-invoice-${id}.pdf`
  })

  useEffect(() => {
    document.title = 'Invoice list'
    setMounted(true)
    fetchAllAndBill()
    return () => setMounted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchAllAndBill = async () => {
    try {
      const response = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(response.data) ? response.data : [])

      const res = await axiosInstance.get(`/purchaselist/all/${id}`)
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

      // fetch bill info for purchase-book
      await fetchBill()
    } catch (error) {
      console.error(error)
      Error('Could not load items.')
    }
  }

  const fetchBill = async () => {
    try {
      const res = await axiosInstance.get(`/purchase-book/${id}`)
      if (mounted && res && res.data) setBillInfo(res.data)
    } catch (err) {
      console.error('Failed to fetch bill info', err)
      Error('Failed to fetch purchase bill info')
    }
  }

  const fetchAllItems = async () => {
    try {
      const res = await axiosInstance.get('/items/all')
      setAllItems(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error(error)
      Error('Could not fetch updated items.')
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
      await axiosInstance.delete(`/purchaselist/delete/${id}/${deleteCandidate.itemId}`)
      // refresh items after delete
      await fetchAllAndBill()
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
    setSelectedItem(null);
    setSearchName('')
    const req = {
      bill_number: id,
      item_id: selectedItem.id,
      discount: Number(selDiscount) || 0,
      quantity: Number(selQuantity) || 0
    }
    try {
      await axiosInstance.post('/purchaselist/add', req)
      // refresh items and allItems after add
      await fetchAllAndBill()
    } catch (err) {
      if (err.response) {
        if (err.response.status === 500) Error('Not enough stock available.')
        else Error(`Server error: ${err.response.status} - ${err.response.data?.message || ''}`)
      } else {
        Error('Failed to add item to purchase list.')
      }
      console.error(err)
    }
  }

  // **Fix**: before generating PDF, temporarily neutralize any sticky/positioned headers
  // that html2canvas might fail to capture properly, then restore styles after PDF generation.
  const handleDownloadPDF = async () => {
    // targetRef can be an object with .current (usual), or a function ref in some implementations.
    const rootEl = targetRef && typeof targetRef === 'object' ? targetRef.current : null
    if (!rootEl) {
      // nothing to print
      Error('Nothing to print (PDF target not available).')
      return
    }

    setPdfGenerating(true)

    // find potentially problematic elements (sticky headers, fixed-position children)
    const nodes = Array.from(rootEl.querySelectorAll('thead th, thead, th, .sticky, [data-sticky]'))

    // store original inline styles to restore after
    const originalStyles = nodes.map((el) => {
      const style = el.getAttribute('style') || ''
      return { el, style }
    })

    // apply temporary neutral styles
    nodes.forEach((el) => {
      // make inline overrides so they are applied during capture
      el.style.position = 'static'
      el.style.top = 'auto'
      el.style.zIndex = 'auto'
      // also ensure display/table layout is preserved
      el.style.display = el.style.display || ''
    })

    try {
      const res = toPDF()
      if (res && typeof res.then === 'function') {
        await res
      }
    } catch (err) {
      console.error('PDF generation failed', err)
      Error('Failed to generate PDF. See console for details.')
    } finally {
      // restore original inline styles
      originalStyles.forEach(({ el, style }) => {
        if (style) el.setAttribute('style', style)
        else el.removeAttribute('style')
      })
      setPdfGenerating(false)
    }
  }

  const formatDate = () => {
    if (billInfo.order_day && billInfo.order_month && billInfo.order_year) {
      return `${billInfo.order_day}/${billInfo.order_month}/${billInfo.order_year}`
    }
    // fallback to created_at or date fields if provided
    if (billInfo.date) return billInfo.date
    if (billInfo.created_at) return billInfo.created_at
    return ''
  }

  // Tab content renderers (kept similar to BuyItems UI)
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
                  <td>{it.s_price ?? it.price ?? it.c_price}</td>
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
                onChange={(e) => setSelQuantity(Number(e.target.value))}
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
                onChange={(e) => setSelDiscount(Number(e.target.value))}
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
              <span className="invoice-preview-bold">Supplier:</span> {billInfo.provider ?? '-'}
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
        <Link to="/purchase" className="btn btn-secondary">
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