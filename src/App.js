import { Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import LoansTaken from './Components/LoansTaken';
import LoansGiven from './Components/LoansGiven';
import PurchaseBook from './Components/PurchaseBook';
import SalesBook from './Components/SalesBook';
import AddItem from './Components/AddItem';
import AddSupplier from './Components/AddSupplier';
import AddBuyer from './Components/AddBuyer';
import AddDriver from './Components/AddDriver';
import TakeLoan from './Components/TakeLoan';
import GiveLoan from './Components/GiveLoan';
import BuyItems from './Components/BuyItems';
import BuyBill from './Components/BuyBill';
import SupplyItems from './Components/SupplyItems';
import SupplyBill from './Components/SupplyBill';

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
      <Route path='/add/loansgive' element={<GiveLoan />}/>
      <Route path='/sales/bill/:id' element={<BuyBill />}/>
      <Route path='/sales/items/:id' element={<BuyItems />}/>
      <Route path='/add/buyer' element={<AddBuyer />}/>
    </Routes>
  );
}

export default App;
