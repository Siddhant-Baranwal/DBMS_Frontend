import { Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './Components/Other/Home';
import PurchaseBook from './Components/Supplier/PurchaseBook';
import SalesBook from './Components/Buyer/SalesBook';
import SupplyBill from './Components/Supplier/SupplyBill';
import SupplyItems from './Components/Supplier/SupplyItems';
import AddSupplier from './Components/Supplier/AddSupplier';
import AddDriver from './Components/Other/AddDriver';
import AddItem from './Components/Other/AddItem';
import LoansTaken from './Components/Loans/LoansTaken';
import LoansGiven from './Components/Loans/LoansGiven';
import TakeLoan from './Components/Loans/TakeLoan';
import GiveLoan from './Components/Loans/GiveLoan';
import BuyBill from './Components/Buyer/BuyBill';
import BuyItems from './Components/Buyer/BuyItems';
import AddBuyer from './Components/Buyer/AddBuyer';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/purchase' element={<PurchaseBook />}/>
      <Route path='/sales' element={<SalesBook />}/>
      <Route path='/purchase/bill/:id' element={<SupplyBill />}/>
      <Route path='/purchase/items/:id' element={<SupplyItems />}/>
      <Route path='/add/supplier' element={<AddSupplier />}/>
      <Route path='/add/driver' element={<AddDriver />}/>
      <Route path='/add/item' element={<AddItem />}/>
      <Route path='/loans/taken' element={<LoansTaken />}/>
      <Route path='/loans/given' element={<LoansGiven />}/>
      <Route path='/add/loanstaken' element={<TakeLoan />}/>
      <Route path='/add/loansgiven' element={<GiveLoan />}/>
      <Route path='/sales/bill/:id' element={<BuyBill />}/>
      <Route path='/sales/items/:id' element={<BuyItems />}/>
      <Route path='/add/buyer' element={<AddBuyer />}/>
    </Routes>
  );
}

export default App;
