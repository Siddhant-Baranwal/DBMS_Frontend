import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance';

export default function BuyItems() {

  const { id } = useParams();
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);

  const deleteHandler = async (itemid) => {
    try {
      await axiosInstance.delete(`/saleslist/delete/${id}/${itemid}`);
      const response = await axiosInstance.get(`/saleslist/all/${id}`);
      const curItems = Array.isArray(response.data) ? response.data.map(element => ({
        name: element[0],
        weight: element[1],
        company: element[2],
        mrp: element[3],
        price: element[4],
        quantity: element[5],
        discount: element[6],
        id: element[7]
      })) : [];
      setItems(curItems);
    } catch (err) {
      console.error('Failed to delete or reload sales list:', err);
    }
  }

  const totalAmount = items.reduce((sum, each) => {
    const gross = each.price * each.quantity;
    const net = gross * (100 - each.discount) / 100;
    return sum + net;
  }, 0);

  const [searchName, setSearchName] = useState('');
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selQuantity, setSelQuantity] = useState(1);
  const [selDiscount, setSelDiscount] = useState(0);

  useEffect(() => {
    const q = (searchName || '').trim().toLowerCase();
    if (q === '') {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(it => it.name.toLowerCase().startsWith(q)));
    }
  }, [searchName, allItems]);

  const onSelectItem = (it) => {
    setSelectedItem(it);
    setSelQuantity(1);
    setSelDiscount(0);
  }

  const onAddClick = async () => {
    if (!selectedItem) return;
    setSelectedItem(null);
    setSearchName('');
    const req = {
      bill_number: id,
      item_id: selectedItem.id,
      discount: Number(selDiscount),
      quantity: Number(selQuantity)
    };
    try {
      const res = await axiosInstance.post('/saleslist/add', req);      
      console.log(res);
      const response = await axiosInstance.get(`/saleslist/all/${id}`);
      const curItems = Array.isArray(response.data) ? response.data.map(element => ({
        name: element[0],
        weight: element[1],
        company: element[2],
        mrp: element[3],
        price: element[4],
        quantity: element[5],
        discount: element[6],
        id: element[7]
      })) : [];
      setItems(curItems);
    } catch (err) {
      if(err.response){
        if(err.response.status === 500){
          alert('Not enough stock available.');
        }
        else{
          alert(`Server error: ${err.response.status} - ${err.response.data?.message || ''}`);
        }
      }
      console.error('Failed to add item to sales list or reload:', err);
    }
  }

  useEffect(() => {
    document.title = 'Invoice list';

    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get('/items/all');
        setAllItems(response.data);
        const res = await axiosInstance.get(`/saleslist/all/${id}`);
        const curItems = Array.isArray(res.data) ? res.data.map(element => ({
          name: element[0],
          weight: element[1],
          company: element[2],
          mrp: element[3],
          price: element[4],
          quantity: element[5],
          discount: element[6],
          id: element[7]
        })) : [];
        setItems(curItems);
      } catch (error) {
        console.error("Error fetching items or sales list:", error);
      }
    };

    fetchItems();
  }, [id]);

  return (
    <div className='page-container animate-fade-in'>
      <div className="page-header">
        <h1 className="page-title">Bill {id}:</h1>
        <Link to="/sales" className="btn btn-secondary">Save</Link>
      </div>
      <div className='table-wrapper'>
        <table className='data-table'>
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
            {items.map((each, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{each.name}</td>
                  <td>{each.weight}</td>
                  <td>{each.company}</td>
                  <td>{each.mrp}</td>
                  <td>{each.price}</td>
                  <td>{each.quantity}</td>
                  <td>{each.discount}</td>
                  <td>{(each.quantity * each.price * (100 - each.discount) / 100).toFixed(2)}</td>
                  <td><button className='btn-icon btn-delete' onClick={() => deleteHandler(each.id)}>&#128465;</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <h2 className='total-summary'>Total: {totalAmount.toFixed(2)}</h2>
      <div className='add-item-section'>
        <div className='search-and-select'>
          <div className='form-group'>
            <label className='form-label'>Search item by name:</label>
            <input
              className='form-input'
              name='searchName'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder='Type item name'
            />
          </div>

          <div className='table-wrapper search-results'>
            <table className='data-table'>
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
                  <tr key={idx} onClick={() => onSelectItem(it)} className='table-row-hover'>
                    <td>{idx + 1}</td>
                    <td>{it.name}</td>
                    <td>{it.weight}</td>
                    <td>{it.company}</td>
                    <td>{it.price}</td>
                    <td>{it.stock}</td>
                    <td>{it.mrp}</td>
                    <td>{it.tax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='selected-item-card'>
          {selectedItem ? (
            <div>
              <p className='selected-item-title'>Selected: {selectedItem.name} ({selectedItem.weight})</p>

              <div className='form-group'>
                <label className='form-label'>Quantity:</label>
                <input
                  className='form-input'
                  name='selQuantity'
                  type='number'
                  min='1'
                  value={selQuantity}
                  onChange={(e) => setSelQuantity(Number(e.target.value))}
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>Discount (%): </label>
                <input
                  className='form-input'
                  name='selDiscount'
                  type='number'
                  min='0'
                  max='100'
                  value={selDiscount}
                  onChange={(e) => setSelDiscount(e.target.value)}
                />
              </div>

              <div className='action-bar'>
                <button type='button' onClick={onAddClick} className='btn btn-primary'>Add</button>
              </div>
            </div>
          ) : (
            <p className='placeholder-text'>No item selected</p>
          )}
          <a href='/add/item' target='_blank' className='btn-link'>Add New Item to Database</a>
        </div>
      </div>
    </div>
  )
}
