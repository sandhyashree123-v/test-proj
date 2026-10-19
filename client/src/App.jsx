import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import CatalogPage from './pages/CatalogPage';
import SkillDetailPage from './pages/SkillDetailPage';
import CertificateVerificationPage from './pages/CertificateVerificationPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/skills/:id" element={<SkillDetailPage />} />
          <Route path="/verify-certificate" element={<CertificateVerificationPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
