import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Convert from './pages/Convert';
import Compress from './pages/Compress';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout d-flex flex-column min-vh-100 bg-body-tertiary">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/convert" element={<Convert />} />
            <Route path="/compress" element={<Compress />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
