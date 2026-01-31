import { Ticket, Clock, CheckCircle } from 'lucide-react';

const VoucherCard = ({ voucher, onSelect, isSelected, disabled }) => {
    
    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    const formatDate = (dateStr) => {
        if(!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    // Tính toán hiển thị giá trị giảm
    const renderDiscountValue = () => {
        if (voucher.discountType === 'PERCENTAGE') {
            return <span className="text-xl font-bold text-orange-600">{voucher.discountValue}%</span>;
        }
        return <span className="text-xl font-bold text-orange-600">{formatCurrency(voucher.discountValue)}</span>;
    };

    return (
        <div 
            className={`relative flex bg-white border rounded-lg overflow-hidden shadow-sm transition-all 
            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-md cursor-pointer'}
            ${isSelected ? 'ring-2 ring-cyan-500 bg-cyan-50' : 'border-gray-200'}
            `}
            onClick={() => !disabled && onSelect && onSelect(voucher)}
        >
            {/* Phần trái: Icon & Mã */}
            <div className="bg-cyan-600 w-24 flex flex-col items-center justify-center text-white p-2 border-r border-dashed border-white relative">
                <Ticket size={24} className="mb-1" />
                <span className="font-mono font-bold text-sm break-all text-center">{voucher.code}</span>
                {/* Răng cưa trang trí */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full"></div>
            </div>

            {/* Phần phải: Thông tin chi tiết */}
            <div className="flex-1 p-3 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            {renderDiscountValue()}
                            {voucher.maxDiscountAmount && (
                                <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">
                                    Tối đa {formatCurrency(voucher.maxDiscountAmount)}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-1" title={voucher.description}>
                            {voucher.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Đơn tối thiểu: {formatCurrency(voucher.minOrderValue)}
                        </p>
                    </div>
                    {isSelected && <CheckCircle className="text-cyan-600" size={20} />}
                </div>

                <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex items-center text-xs text-gray-400 gap-1">
                    <Clock size={12} />
                    <span>HSD: {formatDate(voucher.endDate)}</span>
                </div>
            </div>
        </div>
    );
};

export default VoucherCard;