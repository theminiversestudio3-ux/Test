import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, ArrowLeft, Check, Shield, Truck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/catalog/products/${id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse h-96 bg-gray-100 rounded-2xl"></div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to kits
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="bg-gray-50 p-8 flex items-center justify-center border-r border-gray-200">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full max-w-md rounded-2xl shadow-lg object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full max-w-md aspect-square bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="mb-2 flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {product.difficultyLevel}
              </span>
              {product.ageRecommendation && (
                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Age {product.ageRecommendation}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">What you'll learn:</h3>
              <p className="text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                {product.learningOutcome}
              </p>
            </div>

            {product.componentsList && product.componentsList.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Included in the box:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.componentsList.map((component, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{component}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-gray-100">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                  <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  added 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {added ? (
                  <><Check className="h-6 w-6" /> Added to Cart</>
                ) : (
                  <><ShoppingCart className="h-6 w-6" /> Add to Cart</>
                )}
              </button>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span>Free Shipping over $50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
