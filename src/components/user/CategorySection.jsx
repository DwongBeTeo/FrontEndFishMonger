import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosConfig from '../../util/axiosConfig';
import ProductCard from './ProductCard'; // Component hiển thị 1 cái thẻ sản phẩm
import { API_ENDPOINTS } from '../../util/apiEndpoints';

const CategorySection = ({ categoryId, title, subTitle ,slug}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                // Gọi API lấy 4 hoặc 8 sản phẩm của danh mục này
                // Backend của bạn: /products/category/{id}
                const response = await axiosConfig.get(API_ENDPOINTS.GET_4PRODUCTS_BY_CATEGORY(categoryId));
                if (response.data && response.data.content) {
                    setProducts(response.data.content);
                }
            } catch (error) {
                console.error(`Lỗi tải danh mục ${categoryId}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsByCategory();
    }, [categoryId]); // Khi ID thay đổi thì gọi lại

    // Nếu không có sản phẩm nào và đã load xong thì ẩn section này đi
    if (!loading && products.length === 0) return null;

    return (
        <section className="py-8 mb-6 border-b border-gray-100">
            <div className="container mx-auto px-4">
                {/* Header của Section */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 uppercase">{title}</h2>
                        {subTitle && <p className="text-gray-500 mt-1 text-sm">{subTitle}</p>}
                    </div>
                    {/* Nút xem tất cả dẫn đến trang filter danh mục đó */}
                    <Link to={`/category/${slug}/${categoryId}`} 
                    className="text-red-500 font-semibold border border-red-500 px-4 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all text-sm">
                        Xem tất cả &rarr;
                    </Link>
                </div>

                {/* Grid Sản phẩm */}
                {loading ? (
                    <div className="text-center py-10">Đang tải {title}...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategorySection;