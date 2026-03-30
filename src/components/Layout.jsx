import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={`flex-1 flex flex-col min-h-screen ${isMobile ? 'ml-0 pt-16' : ''}`}>
        <div className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
