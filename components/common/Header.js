import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="bg-white text-purple-600 px-2 py-1 rounded mr-2">D</span>
          DigitalAssetStore
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="/products" className="hover:text-purple-200 transition">Marketplace</Link>
            <Link href="/bundles" className="hover:text-purple-200 transition">Bundles</Link>
            <Link href="/about" className="hover:text-purple-200 transition">About</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative hover:text-purple-200 transition">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
            
            <Link href="/account" className="hover:text-purple-200 transition">
              <User size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}