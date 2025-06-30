import { useEffect, useState } from 'react';
import ProductCard from '../../components/products/ProductCard';
import BundleCard from '../../components/products/BundleCard';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bundlesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/bundles'),
        ]);

        const productsData = await productsRes.json();
        const bundlesData = await bundlesRes.json();

        setProducts(productsData);
        setBundles(bundlesData);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Digital Assets Marketplace</h1>
        
        {/* Bundle Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-purple-700">Bundle & Save</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map(bundle => (
              <BundleCard 
                key={bundle.id} 
                bundle={bundle}
                onAddToCart={() => handleAddToCart(bundle.id)}
              />
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-purple-700">All Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={() => handleAddToCart(product.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}