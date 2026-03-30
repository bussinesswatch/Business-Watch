import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1 p-8">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
