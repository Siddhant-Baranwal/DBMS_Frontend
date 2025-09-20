// Page 14
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function BuyItems() {
  const {id} = useParams();
  const [allItems, setAllItems] = useState([
    {
      itemid: 1,
      tax: 5,
      company: 'Hoesigh',
      available: 0,
      price: 23,
      mrp: 30,
      name: 'Zandu Aohe',
      weight: '100gm'
    },
    {
      itemid: 2,
      tax: 5,
      company: 'HUL',
      available: 0,
      price: 2.85,
      mrp: 3,
      name: 'Shampoo',
      weight: '2ml'
    },
    {
      itemid: 3,
      tax: 5,
      company: 'Zydus Wellness',
      available: 0,
      price: 243,
      mrp: 300,
      name: 'Zandu Chyawanprash',
      weight: '1kg'
    },
    {
      itemid: 4,
      tax: 12,
      company: 'Johnson & Johnson',
      available: 0,
      price: 243,
      mrp: 300,
      name: 'Johnson Baby Powder',
      weight: '200gm'
    }
  ])
  const [items, setItems] = useState([
    {
      name: 'Glucon-D',
      weight: '100gm',
      price: 38,
      quantity: 3,
      discount: 10,
      company: 'HUL',
      itemid: 32,
      mrp: 50,
      tax: 12
    },
    {
      name: 'Glucon-D',
      weight: '1kg',
      price: 480,
      quantity: 3,
      discount: 15,
      company: 'HUL',
      itemid: 23,
      mrp: 500,
      tax: 12
    },
    {
      name: 'Glucon-D',
      weight: '500gm',
      price: 197,
      quantity: 3,
      discount: 17,
      company: 'HUL',
      itemid: 3,
      mrp: 240,
      tax: 12
    },
    {
      name: 'Glucon-D',
      weight: '200gm',
      price: 80,
      quantity: 3,
      discount: 10,
      company: 'HUL',
      itemid: 2,
      mrp: 100,
      tax: 12
    }
  ]);

  const deleteHandler = (itemid) => {
    // delete sales list having bill id id and item id itemid. Then setItems(get the new items)
    console.log(itemid);
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

  React.useEffect(() => {
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

  const onAddClick = () => {
    if (!selectedItem) return;
    setSelectedItem(null);
    setSearchName('');
    // Add the entry of bill id, item id, discount, quantity to the sales list.
    console.log(selectedItem.name, selectedItem.itemid, Number(selDiscount), Number(selQuantity));
  }

  return (
    <div>
      <h1 class='title'>Bill number : {id}</h1>
      <table class='table itemstable' border='1'>
        <thead class='tablehead'>
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
        <tbody class='tablebody'>
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
              <td>{(each.quantity * each.price * (100 - each.discount)/100).toFixed(2)}</td>
              <td class='deleteitem' onClick={() => deleteHandler(each.itemid)}>&#128465;</td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <h1>Total: {totalAmount.toFixed(2)}</h1>
      <div>
        <div>
          <p>Search item by name:</p>
          <input
            name='searchName'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder='Type item name'
          />
        </div>

        <div>
          <table class='table searchtable' border='1'>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Weight</th>
                <th>Company</th>
                <th>Price</th>
                <th>MRP</th>
                <th>Tax</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((it, idx) => (
                <tr key={idx} onClick={() => onSelectItem(it)}>
                  <td>{idx + 1}</td>
                  <td>{it.name}</td>
                  <td>{it.weight}</td>
                  <td>{it.company}</td>
                  <td>{it.price}</td>
                  <td>{it.mrp}</td>
                  <td>{it.tax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {selectedItem ? (
            <div>
              <p>Selected: {selectedItem.name} ({selectedItem.weight})</p>

              <div>
                <label>Quantity: </label>
                <input
                  name='selQuantity'
                  type='number'
                  min='1'
                  value={selQuantity}
                  onChange={(e) => setSelQuantity(e.target.value)}
                />
              </div>

              <div>
                <label>Discount (%): </label>
                <input
                  name='selDiscount'
                  type='number'
                  min='0'
                  max='100'
                  value={selDiscount}
                  onChange={(e) => setSelDiscount(e.target.value)}
                />
              </div>

              <div>
                <button type='button' onClick={onAddClick}>Add</button>
              </div>
            </div>
          ) : (
            <p>No item selected</p>
          )}
          <button class='additem'><a href='/add/item' target='_blank'>New item</a></button>
        </div>

      </div>
    </div>
  )
}
