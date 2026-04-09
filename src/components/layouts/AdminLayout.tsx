import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Cpu
} from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user, loading, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin-dashboard/products', icon: Package },
    { name: 'Orders', path: '/admin-dashboard/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin-dashboard/users', icon: Users },
    { name: 'Settings', path: '/admin-dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path !== '/admin-dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-lg">Admin Panel</span>
          {/* Mobile menu toggle would go here */}
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
