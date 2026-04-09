export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  componentsList: string[];
  learningOutcome: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  ageRecommendation: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  videoTutorialId?: string;
  pdfManualUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
