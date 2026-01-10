import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Format tiền tệ
  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Ảnh sản phẩm */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300'} 
          alt={product.name}
          crossOrigin="anonymous"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge nếu có (ví dụ Mới, Giảm giá) */}
        {product.stockQuantity === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Hết hàng</span>
        )}
      </Link>

      {/* Thông tin */}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.categoryName || 'Danh mục'}</div>
        <Link to={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px] hover:text-blue-600 transition-colors">
            {product.name}
            </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-blue-600 text-lg">{formatPrice(product.price)}</span>
          
          <button className="p-2 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;