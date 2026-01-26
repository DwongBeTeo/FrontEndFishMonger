import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Tag, ArrowRight } from 'lucide-react';
import axiosConfig from '../../../util/axiosConfig';
import Pagination from '../../../components/common/Pagination';

const ServiceListPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Hàm gọi API (kết hợp cả tìm kiếm và lấy tất cả)
    const fetchServices = async () => {
        setLoading(true);
        try {
            const endpoint = keyword.trim() ? '/service-types/search' : '/service-types';
            const res = await axiosConfig.get(endpoint, {
                params: {
                    keyword: keyword.trim() || null,
                    page: page,
                    size: 8 // Lấy 8 dịch vụ mỗi trang cho đẹp lưới 4x2
                }
            });
            // Backend trả về Page<DTO> nên dữ liệu nằm trong res.data.content
            const responseData = res.data;
            const total = responseData.page?.totalPages || responseData.totalPages || 0;
            
            setServices(responseData.content || []); // content thường nằm ở root
            setTotalPages(total);
        } catch (error) {
            console.error("Lỗi tải dịch vụ:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search hoặc tìm khi bấm Enter (ở đây dùng effect đơn giản khi page/keyword đổi)
    useEffect(() => {
        fetchServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]); 

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // Reset về trang 1 khi tìm kiếm mới
        fetchServices();
    };

    // Format tiền tệ Việt Nam
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header & Search */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Dịch vụ Chăm sóc Cá Cảnh Chuyên nghiệp</h1>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Chúng tôi cung cấp các gói dịch vụ vệ sinh, setup và bảo dưỡng hồ cá tốt nhất, giúp bạn tiết kiệm thời gian và tận hưởng vẻ đẹp của bể cá.
                    </p>
                    
                    <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
                        <input 
                            type="text" 
                            placeholder="Tìm dịch vụ (VD: Vệ sinh, Setup...)" 
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm transition-all"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-cyan-700 transition-colors">
                            Tìm
                        </button>
                    </form>
                </div>

                {/* Grid Services */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                                {/* Image Area */}
                                <div className="h-48 overflow-hidden relative group">
                                    <img 
                                        src={service.imageUrl || 'https://via.placeholder.com/400x300?text=Service'} 
                                        alt={service.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-cyan-700 shadow-sm flex items-center gap-1">
                                        <Clock size={12} />
                                        {service.estimatedDuration} phút
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1" title={service.name}>
                                        {service.name}
                                    </h3>
                                    {/* Mô tả ngắn (cắt bớt nếu dài) */}
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                                        {service.description || "Chưa có mô tả chi tiết cho dịch vụ này."}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">Giá tham khảo</span>
                                            <span className="font-bold text-cyan-600 text-lg">
                                                {formatCurrency(service.price)}
                                            </span>
                                        </div>
                                        <Link 
                                            to={`/services/${service.id}`} 
                                            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-cyan-600 transition-all"
                                            title="Xem chi tiết"
                                        >
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <Tag size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Không tìm thấy dịch vụ nào phù hợp.</p>
                    </div>
                )}

                {/* Phân trang */}
                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default ServiceListPage;