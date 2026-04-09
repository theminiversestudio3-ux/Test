import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/catalog/products');
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

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="bg-gray-200 h-80 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Learning Kits</h1>
        <p className="text-gray-600">Discover the perfect kit for your electronics journey.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Check back later for new kits!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col">
              <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
                {product.difficultyLevel && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-gray-800 shadow-sm">
                    {product.difficultyLevel}
                  </div>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.title}</h3>
                </Link>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="font-bold text-xl text-gray-900">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addItem(product)}
                    disabled={product.stock <= 0}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
