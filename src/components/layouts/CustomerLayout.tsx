import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Cpu } from 'lucide-react';
import { useState } from 'react';

export default function CustomerLayout() {
  const { user, loginWithGoogle, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">ElectroKits</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Kits</Link>
              <Link to="/categories" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Categories</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About</Link>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                    <span className="font-medium text-sm">{user.displayName}</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="text-gray-400 hover:text-red-600 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <Link to="/cart" className="relative text-gray-600">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
            <Link to="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Kits</Link>
            <Link to="/categories" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Categories</Link>
            {user ? (
              <>
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Profile</Link>
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Admin Dashboard</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign Out</button>
              </>
            ) : (
              <button onClick={loginWithGoogle} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Sign In</button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">ElectroKits</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering the next generation of engineers with premium DIY electronics learning kits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white transition-colors">All Kits</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ElectroKits. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
