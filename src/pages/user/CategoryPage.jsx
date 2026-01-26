import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// Đảm bảo đường dẫn import đúng với project của bạn
import axiosConfig from '../../util/axiosConfig';
import { API_ENDPOINTS } from '../../util/apiEndpoints';
import ProductCard from '../../components/user/ProductCard';
import Pagination from '../../components/common/Pagination';

const CategoryPage = () => {
  // Lấy categoryId từ URL (ví dụ: /category/10 -> id = 10)
  const { slug, categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('Danh mục'); // Để hiển thị tên danh mục
  
  // State phân trang
  const [pagination, setPagination] = useState({
    page: 0,
    size: 3, // Grid 4 cột thì để size 8, 12 hoặc 16 nhìn sẽ đẹp
    totalPages: 0,
    totalElements: 0
  });

  // Hàm gọi API
    const fetchProductsByCategory = async (pageNo) => {
    setLoading(true);
    try {
      const params = {
        page: pageNo,
        size: pagination.size
      };

      // Gọi API
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_PRODUCTS_BY_CATEGORY(categoryId), { params });
      
      // DEBUG: Hãy mở F12 xem log này để biết chính xác cấu trúc trả về
      console.log("Response API Category:", res.data);

      if (res.data) {
        // Xử lý trường hợp response trả về nằm phẳng (Spring Default) hoặc lồng trong object 'page'
        const content = res.data.content || [];
        // API trả về kiểu json "page":{}
        const pageInfo = res.data.page || {};

        const totalPages = pageInfo.totalPages || 0;
        const totalElements = pageInfo.totalElements || 0;
        const number = pageInfo.number || 0;

        setProducts(content);
        
        setPagination(prev => ({
          ...prev,
          page: number,
          totalPages: totalPages,
          totalElements: totalElements
        }));

        // Logic lấy tên danh mục từ sản phẩm đầu tiên
        if (content.length > 0 && content[0].categoryName) {
            setCategoryName(content[0].categoryName);
        } else if (content.length === 0) {
            setCategoryName("Danh mục trống");
        }
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
      setCategoryName("Không tìm thấy danh mục");
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  // Gọi API khi categoryId thay đổi hoặc component được mount
  useEffect(() => {
    console.log("Đang tải sản phẩm cho ID:", categoryId);
    // Reset về trang 0 khi chuyển sang danh mục khác
    fetchProductsByCategory(0);
  }, [categoryId]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchProductsByCategory(newPage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb (Đường dẫn) */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link> 
            <span>/</span>
            <span className="font-semibold text-gray-800">{categoryName}</span>
        </div>

        {/* Tiêu đề & Thông tin kết quả */}
        <div className="mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{categoryName}</h1>
            <p className="text-gray-500">
                Tìm thấy <span className="font-bold text-gray-800">{pagination.totalElements}</span> sản phẩm
            </p>
        </div>

        {/* Grid Sản phẩm */}
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        ) : products.length > 0 ? (
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Phân trang */}
                <Pagination 
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </>
        ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 text-lg">Chưa có sản phẩm nào trong danh mục này.</p>
                <Link to="/" className="text-blue-600 mt-4 inline-block hover:underline">Quay về trang chủ</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;