import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data.success) {
          setProducts(data.data.items);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg shadow">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-gray-600">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductCatalog;
