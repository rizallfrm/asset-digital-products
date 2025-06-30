import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Digital Asset Store</h3>
            <p className="text-gray-400 text-sm">
              Premium digital assets for designers and developers.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-white text-sm">All Products</Link></li>
              <li><Link href="/bundles" className="text-gray-400 hover:text-white text-sm">Bundles</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white text-sm">Categories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact"className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
              <li><Link href="/faq"className="text-gray-400 hover:text-white text-sm">FAQs</Link></li>
              <li><Link href="/license" className="text-gray-400 hover:text-white text-sm">License</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white text-sm">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} Digital Asset Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}