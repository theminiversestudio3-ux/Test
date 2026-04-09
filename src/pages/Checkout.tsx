import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, Lock } from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(5, 'Valid pincode/zip is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      email: user?.email || '',
    }
  });

  if (items.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) {
      alert("Please sign in to complete your order.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal(),
        status: 'pending',
        paymentStatus: 'paid', // Simulating successful payment for this prototype
        shippingAddress: {
          fullName: data.fullName,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone
        },
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-200">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your learning journey begins soon. We've sent a confirmation email with your order details.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    {...register('fullName')} 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    {...register('email')} 
                    type="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                  {...register('street')} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    {...register('city')} 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    {...register('state')} 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Pincode</label>
                  <input 
                    {...register('pincode')} 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  {...register('phone')} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.product?.title || 'Product'}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-2xl text-gray-900">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting || !user}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : (
                <>
                  <Lock className="h-5 w-5" /> Pay ${getTotal().toFixed(2)}
                </>
              )}
            </button>
            
            {!user && (
              <p className="text-red-500 text-sm text-center mt-3 font-medium">
                Please sign in to complete your order.
              </p>
            )}
            
            <p className="text-gray-500 text-xs text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Secure encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
