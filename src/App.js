import { Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import LoansTaken from './Components/LoansTaken';
import LoansGiven from './Components/LoansGiven';
import PurchaseBook from './Components/PurchaseBook';
import SalesBook from './Components/SalesBook';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/loans/taken' element={<LoansTaken />}/>
      <Route path='/loans/given' element={<LoansGiven />}/>
      <Route path='/purchase' element={<PurchaseBook />}/>
      <Route path='/sales' element={<SalesBook />}/>
    </Routes>
  );
}

export default App;
