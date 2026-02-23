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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const validPages: Page[] = ['home', 'clients', 'services', 'about', 'contact', 'admin', 'privacy', 'tos'];

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '') as Page;
  return validPages.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage,     setCurrentPage]     = useState<Page>(getPageFromHash);
  const [clientsCategory, setClientsCategory] = useState<string>('all');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when user picks a category from the Clients dropdown in the header
  const handleClientsCategory = (category: string) => {
    setClientsCategory(category);
    setCurrentPage('clients');
    window.location.hash = 'clients';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset category to 'all' when navigating away from clients
  useEffect(() => {
    if (currentPage !== 'clients') setClientsCategory('all');
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => setCurrentPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showFooter = currentPage !== 'admin';

  return (
    <div className="min-h-screen">
      <Header
        currentPage={currentPage}
        onNavigate={navigate}
        onClientsCategory={handleClientsCategory}
      />

      <main>
        {currentPage === 'home'     && <HomePage    onNavigate={navigate} />}
        {currentPage === 'clients'  && <ClientsPage initialCategory={clientsCategory} />}
        {currentPage === 'services' && <ServicesPage onNavigate={navigate} />}
        {currentPage === 'about'    && <AboutPage   onNavigate={navigate} />}
        {currentPage === 'contact'  && <ContactPage />}
        {currentPage === 'admin'    && <AdminPage   />}
        {currentPage === 'privacy'  && <PrivacyPolicy  onNavigate={navigate} />}
        {currentPage === 'tos'      && <TermsOfService onNavigate={navigate} />}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}