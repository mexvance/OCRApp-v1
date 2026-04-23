import './App.css';
import InputMatch from './pages/InputMatch';
import ScanLog from './pages/ScanLog';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<InputMatch />} />
          <Route path="/scan-log" element={<ScanLog />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
