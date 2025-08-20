import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import CredibilitySection from './components/CredibilitySection.jsx';
import PortfoliosPage from './pages/PortfoliosPage.jsx';
import BotsIndividualesPage from './pages/BotsIndividualesPage.jsx';
import ResultadosPage from './pages/ResultadosPage.jsx';
import ContactoPage from './pages/ContactoPage.jsx';
import BotDetailPage from './pages/BotDetailPage.jsx';
import PortfolioDetailPage from './pages/PortfolioDetailPage.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <CredibilitySection />
              </>
            } />
            <Route path="/portafolios" element={<PortfoliosPage />} />
            <Route path="/portafolios/:portfolioId" element={<PortfolioDetailPage />} />
            <Route path="/bots-individuales" element={<BotsIndividualesPage />} />
            <Route path="/bots-individuales/:botId" element={<BotDetailPage />} />
            <Route path="/resultados" element={<ResultadosPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


