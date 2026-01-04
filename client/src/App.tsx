import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventComponent from './components/event/event';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Intro from './components/intro/intro';
import Video from './components/video/video';
import PoliticaPage from './page/PoliticaPage';
import GarantiiPage from './page/GarantiiPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Intro />
              <EventComponent />
              <Video />
            </>
          }
        />
        <Route path="/privacy-policy" element={<PoliticaPage />} />
        <Route path="/garantii" element={<GarantiiPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;