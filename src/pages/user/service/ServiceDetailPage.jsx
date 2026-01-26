import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosConfig from '../../../util/axiosConfig';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axiosConfig.get(`/service-types/${id}`);
                setService(res.data);
            } catch (error) {
                console.error("Lỗi:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Không tìm thấy dịch vụ',
                    text: error.response?.data?.message || 'Dịch vụ có thể đã bị ẩn hoặc xóa.',
                    confirmButtonColor: '#0891b2'
                }).then(() => {
                    navigate('/services'); // Quay về trang danh sách nếu lỗi
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, navigate]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleBooking = () => {
        // Chuyển hướng sang trang đặt lịch, truyền theo ID dịch vụ
        // Ví dụ: /booking?serviceId=1
        navigate(`/booking?serviceId=${service.id}`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
        </div>
    );

    if (!service) return null;

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Breadcrumb / Back Button */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/services" className="inline-flex items-center text-gray-500 hover:text-cyan-600 transition-colors">
                        <ArrowLeft size={18} className="mr-2" />
                        Quay lại danh sách dịch vụ
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Image */}
                    <div className="space-y-6">
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 aspect-video relative">
                            <img 
                                src={service.imageUrl || 'https://via.placeholder.com/800x600?text=Service+Detail'} 
                                alt={service.name} 
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Badge */}
                            <div className="absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                                Dịch vụ Hot
                            </div>
                        </div>
                        
                        {/* Cam kết nhỏ */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                                <ShieldCheck className="mx-auto text-cyan-600 mb-2" size={24} />
                                <span className="text-xs font-semibold text-gray-700 block">Bảo hành 100%</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                                <Clock className="mx-auto text-cyan-600 mb-2" size={24} />
                                <span className="text-xs font-semibold text-gray-700 block">Đúng giờ hẹn</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                                <CheckCircle className="mx-auto text-cyan-600 mb-2" size={24} />
                                <span className="text-xs font-semibold text-gray-700 block">NV Chuyên nghiệp</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {service.name}
                        </h1>

                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 mb-1">Thời gian thực hiện</span>
                                <div className="flex items-center gap-2 font-medium text-gray-700">
                                    <Clock size={20} className="text-cyan-600" />
                                    {service.estimatedDuration} phút
                                </div>
                            </div>
                            <div className="h-10 w-px bg-gray-200"></div>
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500 mb-1">Đơn giá tham khảo</span>
                                <div className="font-bold text-2xl text-cyan-600">
                                    {formatCurrency(service.price)}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-sm text-gray-600 mb-8 flex-grow">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Mô tả dịch vụ</h3>
                            <p className="whitespace-pre-line leading-relaxed">
                                {service.description || "Dịch vụ này chưa có mô tả chi tiết. Vui lòng liên hệ hotline để được tư vấn thêm."}
                            </p>
                            
                            {/* Fake list lợi ích (có thể hardcode hoặc lấy từ DB nếu có) */}
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-500" />
                                    <span>Vệ sinh sạch sẽ, an toàn cho cá</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-500" />
                                    <span>Sử dụng thiết bị chuyên dụng hiện đại</span>
                                </li>
                            </ul>
                        </div>

                        {/* Call to Action */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mt-auto">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-gray-900 font-bold text-lg">Bạn đã sẵn sàng?</p>
                                    <p className="text-sm text-gray-500">Đặt lịch ngay để nhân viên đến hỗ trợ.</p>
                                </div>
                                <button 
                                    onClick={handleBooking}
                                    className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-200 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Calendar size={20} />
                                    Đặt Lịch Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;