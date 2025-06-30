import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Check auth for protected routes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthPage = ['/auth/login', '/auth/register'].includes(router.pathname);
    const isAdminPage = router.pathname.startsWith('/dashboard/admin');

    if (!token && !isAuthPage) {
      router.push('/auth/login');
    } else if (token && isAuthPage) {
      router.push('/products');
    } else if (token && isAdminPage) {
      // Verify admin role
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role !== 'admin') {
        router.push('/products');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default MyApp;