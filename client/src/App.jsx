import './App.css'
import InputMatch from './pages/InputMatch'
import OcrApp from './pages/OCRPage'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/InputMatch">Input Matcher</Link>
      </nav>
      <Routes>
        <Route path="/" element={<OcrApp/>} />
        <Route path="/InputMatch" element={<InputMatch/>} />
      </Routes>
    </Router>
    
    
  )
}

export default App
