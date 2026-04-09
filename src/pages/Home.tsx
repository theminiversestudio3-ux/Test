import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BookOpen, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                Build the Future with <span className="text-blue-500">ElectroKits</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                Premium DIY electronics learning kits for students, hobbyists, and future engineers. Learn by building real projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2">
                  Shop Kits <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/categories" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition-colors">
                  Explore Categories
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img 
                src="https://picsum.photos/seed/electronics/800/600" 
                alt="Electronics Kit" 
                className="relative rounded-2xl shadow-2xl border border-gray-800 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ElectroKits?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We provide everything you need to go from absolute beginner to confident maker.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Guides</h3>
              <p className="text-gray-600">Every kit includes step-by-step video tutorials and detailed PDF manuals to ensure your success.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Components</h3>
              <p className="text-gray-600">We source only high-quality, tested components so you spend time learning, not debugging bad parts.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-World Skills</h3>
              <p className="text-gray-600">Learn actual circuit design, soldering, and programming skills used by professional engineers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Kits</h2>
              <p className="text-gray-600">Our most popular learning experiences.</p>
            </div>
            <Link to="/products" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* We will fetch real products here later, for now just a message to go to products page */}
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
              <Cpu className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading our latest kits...</h3>
              <Link to="/products" className="text-blue-600 hover:underline">Browse the catalog</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
