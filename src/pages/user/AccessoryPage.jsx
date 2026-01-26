import React, { useEffect, useState } from 'react';
import axiosConfig from '../../util/axiosConfig';
import { API_ENDPOINTS } from '../../util/apiEndpoints';
import ProductCard from '../../components/user/ProductCard';

const AquariumPage = () => {
    // --- CẤU HÌNH CỐ ĐỊNH CHO TRANG phụ kiện ---
    const Accessory_CATEGORY_ID = 8; 

    // State lưu dữ liệu
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State phân trang
    const [pagination, setPagination] = useState({
        page: 0,
        size: 8, // Để 8 hoặc 12 cho đẹp grid 4 cột
        totalPages: 0,
        totalElements: 0
    });

    // Hàm gọi API (Tái sử dụng logic của bạn)
    const fetchProductsByCategory = async (pageNo) => {
        setLoading(true);
        try {
            const params = {
                page: pageNo,
                size: pagination.size
            };

            // Gọi API với ID cố định là 8
            const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_PRODUCTS_BY_CATEGORY(Accessory_CATEGORY_ID), { params });
            
            console.log("Aquarium Response:", res.data);

            if (res.data) {
                // Xử lý dữ liệu trả về (tùy theo cấu trúc BE của bạn: phẳng hoặc lồng trong 'page')
                const content = res.data.content || [];
                const pageInfo = res.data.page || {}; // Nếu BE trả về bọc trong page

                // Fallback nếu pageInfo rỗng (dành cho trường hợp BE trả về phẳng kiểu Spring Data cũ)
                const totalPages = pageInfo.totalPages !== undefined ? pageInfo.totalPages : (res.data.totalPages || 0);
                const totalElements = pageInfo.totalElements !== undefined ? pageInfo.totalElements : (res.data.totalElements || 0);
                const number = pageInfo.number !== undefined ? pageInfo.number : (res.data.number || 0);

                setProducts(content);
                
                setPagination(prev => ({
                    ...prev,
                    page: number,
                    totalPages: totalPages,
                    totalElements: totalElements
                }));
            }
        } catch (error) {
            console.error("Lỗi tải danh mục bể cá:", error);
        } finally {
            setLoading(false);
            window.scrollTo(0, 0); // Cuộn lên đầu trang khi load xong
        }
    };

    // useEffect chạy 1 lần khi trang được mount
    useEffect(() => {
        fetchProductsByCategory(0);
    }, []);

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchProductsByCategory(newPage);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* --- HEADER TRANG --- */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 uppercase">Phụ kiện</h1>
                <p className="text-gray-500 mt-2">Các mẫu bể cá đẹp, hiện đại và phụ kiện setup bể</p>
                <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* --- DANH SÁCH SẢN PHẨM --- */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
            ) : products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            // Giả sử bạn đã có component ProductCard
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* --- PHÂN TRANG (PAGINATION) --- */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-10">
                            <button 
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 0}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                            >
                                Trước
                            </button>
                            <span className="text-gray-600 font-medium">
                                Trang {pagination.page + 1} / {pagination.totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages - 1}
                                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p>Hiện chưa có sản phẩm nào trong danh mục này.</p>
                </div>
            )}
        </div>
    );
};

export default AquariumPage;