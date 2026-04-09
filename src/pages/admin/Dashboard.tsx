import { useEffect, useState } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real production app, you'd use Cloud Functions to aggregate these stats
        // rather than fetching all docs, but for this prototype we'll do simple counts
        const productsSnap = await getDocs(collection(db, 'products'));
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const usersSnap = await getDocs(collection(db, 'users'));

        let totalRevenue = 0;
        ordersSnap.forEach(doc => {
          const data = doc.data();
          if (data.paymentStatus === 'paid') {
            totalRevenue += data.totalAmount || 0;
          }
        });

        setStats({
          products: productsSnap.size,
          orders: ordersSnap.size,
          users: usersSnap.size,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading stats...</div>;
  }

  const statCards = [
    { name: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-blue-500' },
    { name: 'Total Products', value: stats.products, icon: Package, color: 'bg-purple-500' },
    { name: 'Total Users', value: stats.users, icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500">More detailed analytics and charts will appear here.</p>
      </div>
    </div>
  );
}
