import React, { useEffect, useState } from 'react';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend API se data fetch karna
    fetch('http://localhost:5005/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.items); // Backend response ke mutabiq items set karna
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-8">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Echo Pride Products</h2>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Product Image */}
            <img 
              src={product.images && product.images[0] ? (product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`) : '/placeholder.jpg'} 
              alt={product.name} 
              width="400"
              height="300"
              loading="lazy"
              decoding="async"
              className="w-full h-48 object-cover"
            />
            
            {/* Product Details */}
            <div className="p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">{product.category}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-extrabold text-gray-900">${product.price}</span>
                <button className="bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
