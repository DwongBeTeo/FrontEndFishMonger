import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosConfig from '../../util/axiosConfig';
import ProductCard from '../../components/user/ProductCard';
import { API_ENDPOINTS } from '../../util/apiEndpoints';

const SearchPage = () => {
    // Lấy params từ URL (ví dụ: ?keyword=koi)
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });

    const fetchSearchResults = async (pageNo = 0) => {
        setLoading(true);
        try {
            // Gọi API Search của Backend
            const response = await axiosConfig.get(API_ENDPOINTS.SEARCH_PRODUCT, {
                params: {
                    keyword: keyword,
                    page: pageNo,
                    size: 8 
                }
            });

            console.log("Search Result:", response.data);

            if (response.data) {
                // Xử lý dữ liệu trả về (tương tự các trang khác của bạn)
                const content = response.data.content || [];
                const pageInfo = response.data.page || {}; 
                
                setProducts(content);
                setPagination({
                    page: pageInfo.number !== undefined ? pageInfo.number : (response.data.number || 0),
                    totalPages: pageInfo.totalPages !== undefined ? pageInfo.totalPages : (response.data.totalPages || 0)
                });
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        } finally {
            setLoading(false);
        }
    };

    // Khi keyword thay đổi (người dùng tìm từ khóa khác), gọi lại API
    useEffect(() => {
        if (keyword) {
            fetchSearchResults(0);
        }
    }, [keyword]);

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <div className="mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Kết quả tìm kiếm cho: <span className="text-cyan-600">"{keyword}"</span>
                </h1>
                {!loading && (
                    <p className="text-sm text-gray-500 mt-1">
                        Tìm thấy {products.length} sản phẩm
                    </p>
                )}
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tìm kiếm...</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">search_off</span>
                    <p className="text-gray-600">Không tìm thấy sản phẩm nào phù hợp với từ khóa này.</p>
                    <p className="text-gray-400 text-sm mt-1">Hãy thử tìm với từ khóa khác (ví dụ: cá, thức ăn...)</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;