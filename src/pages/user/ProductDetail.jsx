import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ChevronRight, Home } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import axiosConfig from '../../util/axiosConfig';

const ProductDetail = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Format tiền tệ
  const formatPrice = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Gọi API lấy chi tiết sản phẩm theo Slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosConfig.get(`products/slug/${slug}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không tìm thấy sản phẩm hoặc sản phẩm đã bị ẩn.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Xử lý tăng giảm số lượng
  const handleQuantityChange = (type) => {
    if (type === 'decrease') {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      // Kiểm tra tồn kho nếu cần
      if (product && quantity < product.stockQuantity) {
        setQuantity((prev) => prev + 1);
      }
    }
  };

  // Xử lý thêm vào giỏ
  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
      <h2 className="text-2xl font-bold mb-2">Đã có lỗi xảy ra</h2>
      <p>{error}</p>
      <Link to="/" className="mt-4 text-blue-600 hover:underline">Quay về trang chủ</Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb (Đường dẫn) */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 flex items-center">
            <Home size={16} className="mr-1"/> Trang chủ
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="hover:text-blue-600 cursor-pointer">
            {product.categoryName || 'Sản phẩm'}
          </span>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Cột Trái: Hình ảnh */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/600'} 
                  alt={product.name}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover object-center"
                />
                {product.stockQuantity === 0 && (
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg transform -rotate-12">
                        HẾT HÀNG
                      </span>
                   </div>
                )}
              </div>
            </div>

            {/* Cột Phải: Thông tin chi tiết */}
            <div className="flex flex-col">
              {/* Danh mục & Tên */}
              <div className="mb-4">
                <span className="text-blue-600 font-medium text-sm tracking-wide uppercase">
                  {product.categoryName}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Giá & Tình trạng */}
              <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
                <span className="text-4xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <div className="mb-2">
                   {product.stockQuantity > 0 ? (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       Còn hàng ({product.stockQuantity})
                     </span>
                   ) : (
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                       Hết hàng
                     </span>
                   )}
                </div>
              </div>

              {/* Mô tả ngắn */}
              <div className="prose prose-sm text-gray-600 mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm:</h3>
                <p className="whitespace-pre-line leading-relaxed">
                  {product.description || "Chưa có mô tả cho sản phẩm này."}
                </p>
              </div>

              {/* Chọn số lượng & Nút mua */}
              <div className="mt-auto">
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1 || product.stockQuantity === 0}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange('increase')}
                      disabled={quantity >= product.stockQuantity || product.stockQuantity === 0}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stockQuantity > 0 
                      ? "Bạn có thể chọn thêm sản phẩm" 
                      : "Sản phẩm hiện đang tạm hết"}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="flex-1 bg-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={24} />
                    Thêm vào giỏ hàng
                  </button>
                  {/* Nút yêu thích hoặc share nếu cần */}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Phần thông tin bổ sung (Meta tags - Demo hiển thị để SEO check) */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 text-gray-500 text-sm">
            <h4 className="font-bold text-gray-700 mb-2">Thông tin bổ sung (SEO):</h4>
            <p><strong>Meta Title:</strong> {product.metaTitle || product.name}</p>
            <p><strong>Meta Keyword:</strong> {product.metaKeyword || 'Không có'}</p>
            <p><strong>Slug:</strong> {product.slug}</p>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;