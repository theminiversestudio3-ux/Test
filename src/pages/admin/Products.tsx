import { useEffect, useState } from 'react';
import { Product } from '../../types';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { getToken } = useAuthStore();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/catalog/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddDemoProduct = async () => {
    setIsAdding(true);
    try {
      const newProduct = {
        title: "Arduino Starter Kit",
        slug: "arduino-starter-kit",
        description: "The perfect kit to start your journey into electronics and programming.",
        componentsList: ["Arduino Uno R3", "Breadboard", "LEDs", "Resistors", "Jumper Wires"],
        learningOutcome: "Basic circuit design and C++ programming.",
        difficultyLevel: "Beginner",
        ageRecommendation: "12+",
        price: 49.99,
        stock: 100,
        categoryId: "microcontrollers",
        images: ["https://picsum.photos/seed/arduino/800/800"],
        isActive: true,
      };
      
      const token = await getToken();
      const response = await fetch('/api/catalog/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error("Validation error:", errorData);
        alert("Failed to add product. Check console for validation errors.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = await getToken();
        await fetch(`/api/catalog/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <button 
          onClick={handleAddDemoProduct}
          disabled={isAdding}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          {isAdding ? 'Adding...' : 'Add Demo Product'}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white rounded-xl border border-gray-200 h-64"></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                          {product.images && product.images[0] && (
                            <img className="h-10 w-10 object-cover" src={product.images[0]} alt="" referrerPolicy="no-referrer" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.difficultyLevel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
