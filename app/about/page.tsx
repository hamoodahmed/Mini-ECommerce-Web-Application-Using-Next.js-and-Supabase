import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-6">
          WHO WE ARE
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">About MiniShop</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn more about our commitment to quality and customer satisfaction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded with a vision to provide exceptional e-commerce experiences, our store has grown into a trusted
            destination for quality products. We pride ourselves on curating items that meet the highest standards
            of quality, design, and functionality.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our team is dedicated to ensuring every customer has an outstanding shopping experience. From our
            carefully selected inventory to our responsive customer service, we focus on every detail to exceed
            your expectations.
          </p>
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To connect customers with the best products at competitive prices while providing exceptional service.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl h-96 w-full flex items-center justify-center">
            <div className="text-white text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-2xl font-bold">Quality Assured</h3>
              <p className="mt-2 opacity-90">Every product is carefully selected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We believe in the power of quality products at accessible prices
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Affordable Prices</h3>
            <p className="text-gray-600">
              We offer a flat 25% discount on selected items, making premium products more affordable for everyone.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">
              Each product is carefully evaluated for quality, durability, and value before being added to our collection.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Shopping</h3>
            <p className="text-gray-600">
              We use secure payment methods and protect your personal information with the highest standards.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Products</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-lg text-gray-600 mb-6 text-center leading-relaxed">
            Our inventory spans multiple categories including Electronics, Clothing, Home Goods, Accessories, and
            Sports equipment. Each product is carefully evaluated for quality, durability, and value before
            being added to our collection.
          </p>
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            We regularly update our product selection to bring you the latest trends and innovations. Whether
            you're looking for everyday essentials or specialty items, we have something for everyone.
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Shopping?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore our extensive collection and take advantage of our flat 25% discount on selected items.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            variant="primary"
            size="lg"
            className="px-8 py-4 text-lg font-bold"
          >
            <a href="/products">Shop Collection</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg font-bold"
          >
            <a href="/">Explore Store</a>
          </Button>
        </div>
      </div>
    </div>
  );
}