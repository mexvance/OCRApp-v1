import './App.css'
import InputMatch from './pages/InputMatch'
import OcrApp from './pages/OCRPage'
import DataLookupMatch from './pages/DataLookupMatch'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
    <Router>
      {/* <nav>
        <Link to="/">Text Verification</Link> {" | "} 
        <Link to="/InputMatch">Input Matcher</Link> {" | "} 
        <Link to="/DataLookupMatch">DataLookupMatch</Link>
      </nav> */}
      <Routes>
        {/* <Route path="/" element={<OcrApp/>} /> */}
        <Route path="/" element={<InputMatch/>} />
        {/* <Route path="/DataLookupMatch" element={<DataLookupMatch/>}/> */}
      </Routes>
    </Router>
    
    
  )
}

export default App
