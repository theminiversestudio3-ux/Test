import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any learning kits yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Browse Kits <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {item.product?.images?.[0] && (
                  <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <Link to={`/product/${item.productId}`} className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors">
                  {item.product?.title || 'Product'}
                </Link>
                <p className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="font-bold text-lg w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-2xl text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
