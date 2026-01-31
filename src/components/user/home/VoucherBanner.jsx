import React, { useEffect, useState } from 'react';
import axiosConfig from '../../../util/axiosConfig';
import { Tag, Copy, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const VoucherBanner = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await axiosConfig.get('/vouchers/available');
                setVouchers(res.data);
            } catch (error) {
                console.error("Lỗi tải voucher:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        
        // 2. Cấu hình SweetAlert2
        Swal.fire({
            title: 'Đã sao chép!',
            text: `Mã ${code} đã sẵn sàng để sử dụng.`,
            icon: 'success',
            timer: 1500, // Tự đóng sau 1.5s
            showConfirmButton: false,
            position: 'center',
            toast: false, // Để false nếu muốn hiện giữa màn hình, true nếu muốn hiện góc nhỏ
        });

        // Reset icon sau 2s
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading || vouchers.length === 0) return null; // Không hiện gì nếu không có voucher

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="text-red-500 fill-red-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Mã giảm giá hot</h2>
            </div>

            {/* Container trượt ngang */}
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
                {vouchers.map((v) => (
                    <div 
                        key={v.id} 
                        className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden relative group snap-start hover:shadow-md transition-all"
                    >
                        {/* Background trang trí */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full -mr-8 -mt-8 z-0"></div>

                        <div className="p-4 flex gap-3 relative z-10">
                            {/* Cột trái: Logo/Icon */}
                            <div className="w-16 h-16 bg-red-50 rounded-lg flex flex-col items-center justify-center text-red-600 border border-red-100 flex-shrink-0">
                                <span className="text-xs font-bold">VOUCHER</span>
                                <span className="font-black text-lg">
                                    {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : 'SALE'}
                                </span>
                            </div>

                            {/* Cột phải: Thông tin */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-sm truncate" title={v.code}>
                                        {v.code}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8" title={v.description}>
                                    {v.description}
                                </p>
                                
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400">HSD: {new Date(v.endDate).toLocaleDateString('vi-VN')}</span>
                                    
                                    <button 
                                        onClick={() => handleCopy(v.code)}
                                        className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 transition-all ${
                                            copiedCode === v.code 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    >
                                        {copiedCode === v.code ? (
                                            <> <CheckCircle size={12}/> Đã lưu </>
                                        ) : (
                                            <> <Copy size={12}/> Lưu mã </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Răng cưa 2 bên (giống vé) */}
                        <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-50 rounded-full border-r border-gray-200"></div>
                        <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-gray-50 rounded-full border-l border-gray-200"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoucherBanner;