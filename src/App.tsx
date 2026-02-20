import { useState, useEffect } from 'react';
import { Page } from './lib/types';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ClientsPage from './pages/ClientsPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

const validPages: Page[] = ['home', 'clients', 'services', 'about', 'contact', 'admin'];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '') as Page;
  return validPages.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showFooter = currentPage !== 'admin';

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={navigate} />
      <main>
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}
        {currentPage === 'clients' && <ClientsPage />}
        {currentPage === 'services' && <ServicesPage onNavigate={navigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={navigate} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && <AdminPage />}
      </main>
      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}
