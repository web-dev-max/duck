import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import PoliticaPage from './page/PoliticaPage';
import GarantiiPage from './page/GarantiiPage';
import HomePage from './page/HomePage';
import AdminPage from './page/AdminPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/privacy-policy" element={<PoliticaPage />} />
        <Route path="/garantii" element={<GarantiiPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;