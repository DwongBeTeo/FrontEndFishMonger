import React from 'react';
// Import thêm RotateCcw (Undo icon)
import { Edit, Trash2, Calendar, Tag, Percent, DollarSign, Copy, RotateCcw } from 'lucide-react';

const VoucherList = ({ vouchers, loading, onEdit, onDelete, onClone, onRestore }) => {
    
    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    if (loading) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
    );

    if (vouchers.length === 0) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Chưa có voucher nào</h3>
            <p className="text-gray-500 mt-1">Hãy tạo mã giảm giá đầu tiên.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                            <th className="px-6 py-4">Mã Voucher</th>
                            <th className="px-6 py-4">Giá trị giảm</th>
                            <th className="px-6 py-4">Điều kiện</th>
                            <th className="px-6 py-4">Thời gian & SL</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vouchers.map((v) => {
                            // Kiểm tra trạng thái Active
                            const isInactive = !v.isActive;

                            return (
                                <tr 
                                    key={v.id} 
                                    // Nếu Inactive thì làm mờ (opacity) và đổi nền xám nhẹ
                                    className={`transition-colors group ${isInactive ? 'bg-gray-50 opacity-60' : 'hover:bg-cyan-50/30'}`}
                                >
                                    {/* Cột Mã */}
                                    <td className="px-6 py-4">
                                        <div className={`font-mono font-bold px-2 py-1 rounded w-fit border ${isInactive ? 'text-gray-500 border-gray-300' : 'text-cyan-700 bg-cyan-50 border-cyan-100'}`}>
                                            {v.code}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={v.description}>
                                            {v.description}
                                        </div>
                                    </td>
                                    
                                    {/* Cột Giá trị giảm */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 font-bold text-gray-800">
                                            {v.discountType === 'PERCENTAGE' ? <Percent size={14} className="text-orange-500"/> : <DollarSign size={14} className="text-green-500"/>}
                                            {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}
                                        </div>
                                        {v.discountType === 'PERCENTAGE' && v.maxDiscountAmount && (
                                            <div className="text-[10px] text-gray-500">
                                                Tối đa: {formatCurrency(v.maxDiscountAmount)}
                                            </div>
                                        )}
                                    </td>

                                    {/* Cột Điều kiện */}
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-600">
                                            Đơn tối thiểu: <span className="font-semibold">{formatCurrency(v.minOrderValue)}</span>
                                        </div>
                                    </td>

                                    {/* Cột Thời gian & SL */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                                            <Calendar size={12}/> 
                                            {v.startDate} - {v.endDate}
                                        </div>
                                        <div className="text-xs">
                                            SL còn lại: <span className={`font-bold ${v.quantity > 0 ? 'text-gray-800' : 'text-red-500'}`}>{v.quantity}</span>
                                        </div>
                                    </td>

                                    {/* Cột Trạng thái */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            v.isActive 
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                                : 'bg-gray-200 text-gray-500 border-gray-300'
                                        }`}>
                                            {v.isActive ? 'Hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>

                                    {/* Cột Thao tác */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            
                                            {/* Nút Clone (Luôn hiện) */}
                                            <button 
                                                onClick={() => onClone(v)}
                                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                title="Sao chép voucher này"
                                            >
                                                <Copy size={18} />
                                            </button>

                                            {/* Nút Sửa (Chỉ cho sửa nếu đang Active, hoặc tùy logic của bạn) */}
                                            <button 
                                                onClick={() => onEdit(v)}
                                                className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            
                                            {/* Logic nút Xóa / Khôi phục */}
                                            {isInactive ? (
                                                <button 
                                                    onClick={() => onRestore(v.id)}
                                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Khôi phục voucher"
                                                >
                                                    <RotateCcw size={18} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => onDelete(v.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Khóa voucher"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VoucherList;