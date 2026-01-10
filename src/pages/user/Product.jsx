import React, { useState, useEffect } from 'react';
import axiosConfig from '../../util/axiosConfig';
import ProductCard from '../../components/user/ProductCard';
import { API_ENDPOINTS } from '../../util/apiEndpoints';
import Pagination from '../../components/common/Pagination';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State filter (Keyword, Category, Price...) - Tạm thời demo list all
  const [filters, setFilters] = useState({
    page: 0,
    size: 8,
    totalPages: 0,
    totalElements: 0
  });

  const fetchProducts = async (pageNo) => {
    setLoading(true);
    try {
      const params = {
        page: pageNo,
        size: filters.size
      };

      // Tùy logic filter mà bạn gọi API search, filter hoặc getAll
      // Ở đây tạm gọi getAllActiveProducts
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_ACTIVE_PRODUCTS, { params });
      
      // API trả về kiểu json "page":{}
      const pageInfo = res.data.page || {};

      const totalPages = pageInfo.totalPages || 0;
      const totalElements = pageInfo.totalElements || 0;
      const number = pageInfo.number || 0;

      setFilters(prev => ({
          ...prev,
          page: number,
          totalPages: totalPages,
          totalElements: totalElements
        }));
      setProducts(res.data.content || []);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < filters.totalPages) {
      fetchProducts(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">Trang chủ / Sản phẩm</div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR FILTER (Bên trái) */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            {/* Filter Danh mục */}
            <div>
                <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm">Danh mục</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li><label className="flex items-center gap-2"><input type="checkbox"/> Cá Koi</label></li>
                    <li><label className="flex items-center gap-2"><input type="checkbox"/> Cá Rồng</label></li>
                    <li><label className="flex items-center gap-2"><input type="checkbox"/> Bể Cá</label></li>
                </ul>
            </div>

            {/* Filter Giá */}
            <div>
                <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm">Khoảng giá</h3>
                <div className="flex gap-2 items-center">
                    <input type="number" placeholder="Min" className="w-full px-2 py-1 border rounded text-sm"/>
                    -
                    <input type="number" placeholder="Max" className="w-full px-2 py-1 border rounded text-sm"/>
                </div>
                <button className="w-full mt-2 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700">Áp dụng</button>
            </div>
        </div>

        {/* MAIN CONTENT (Bên phải) */}
        <div className="flex-1">
            
            {/* Toolbar (Sắp xếp, Số lượng hiển thị) */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h1 className="text-xl font-bold text-gray-800">Tất cả sản phẩm</h1>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm outline-none">
                    <option>Mới nhất</option>
                    <option>Giá tăng dần</option>
                    <option>Giá giảm dần</option>
                </select>
            </div>

            {/* Grid Sản phẩm */}
            {loading ? (
                <div className="text-center py-20">Đang tải sản phẩm...</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">Không tìm thấy sản phẩm nào.</div>
            )}

            {/* Pagination */}
            <Pagination 
              currentPage={filters.page}
              totalPages={filters.totalPages}
              onPageChange={handlePageChange}
            />
        </div>
      </div>
    </div>
  );
};

export default Product;