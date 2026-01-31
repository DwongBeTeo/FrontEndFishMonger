import React, { useState, useEffect } from 'react';
import Input from '../../common/Input';
import axiosConfig from '../../../util/axiosConfig';
import Swal from 'sweetalert2';

const VoucherForm = ({ selectedVoucher, onSuccess, onCancel }) => {
    // Logic xác định chế độ sửa: Phải có object voucher VÀ có ID
    const isEditMode = selectedVoucher && selectedVoucher.id;

    const discountTypes = [
        { value: 'PERCENTAGE', label: 'Giảm theo %' },
        { value: 'FIXED_AMOUNT', label: 'Giảm số tiền cố định' }
    ];

    // Khởi tạo state
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        maxDiscountAmount: '',
        minOrderValue: '',
        quantity: '',
        startDate: '',
        endDate: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);

    // --- HÀM 1: RESET FORM VỀ TRẠNG THÁI MẶC ĐỊNH ---
    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: '',
            maxDiscountAmount: '',
            minOrderValue: '',
            quantity: '',
            startDate: '',
            endDate: '',
            isActive: true
        });
    };

    // --- HÀM 2: ĐIỀN DỮ LIỆU VÀO FORM (FILL DATA) ---
    const fillFormData = (voucher) => {
        setFormData({
            code: voucher.code || '', 
            description: voucher.description || '',
            discountType: voucher.discountType || 'PERCENTAGE',
            discountValue: voucher.discountValue || '',
            maxDiscountAmount: voucher.maxDiscountAmount || '',
            minOrderValue: voucher.minOrderValue || '',
            quantity: voucher.quantity || '',
            startDate: voucher.startDate || '',
            endDate: voucher.endDate || '',
            isActive: voucher.isActive ?? true 
        });
    };

    // useEffect: Theo dõi sự thay đổi của selectedVoucher
    useEffect(() => {
        if (selectedVoucher) {
            // Trường hợp Edit hoặc Clone (có dữ liệu đầu vào)
            fillFormData(selectedVoucher);
        } else {
            // Trường hợp Tạo mới hoàn toàn (nút dấu cộng)
            resetForm();
        }
    }, [selectedVoucher]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!formData.description || !formData.discountValue || !formData.quantity || !formData.startDate || !formData.endDate) {
            Swal.fire('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc.', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                // UPDATE
                await axiosConfig.put(`/admin/vouchers/${selectedVoucher.id}`, formData);
            } else {
                // CREATE (Cho cả tạo mới và clone)
                await axiosConfig.post('/admin/vouchers', formData);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
                
                {/* 1. Mã & Mô tả */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input 
                        label="Mã Voucher (Để trống nếu muốn tự sinh)" 
                        type="text"
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                        placeholder="VD: SALE50"
                        disabled={isEditMode} // Chỉ khóa khi đang Edit thật sự (có ID)
                    />
                    <Input 
                        label="Mô tả *" 
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="VD: Giảm 50k cho đơn từ 200k"
                    />
                </div>

                {/* 2. Loại giảm giá & Giá trị */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                        <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.discountType}
                            onChange={(e) => handleChange('discountType', e.target.value)}
                        >
                            {discountTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    
                    <Input 
                        label={formData.discountType === 'PERCENTAGE' ? "Giá trị (%) *" : "Số tiền giảm (VND) *"}
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => handleChange('discountValue', e.target.value)}
                    />

                    {formData.discountType === 'PERCENTAGE' && (
                        <Input 
                            label="Giảm tối đa (VND)" 
                            type="number"
                            value={formData.maxDiscountAmount}
                            onChange={(e) => handleChange('maxDiscountAmount', e.target.value)}
                            placeholder="VD: 50000"
                        />
                    )}
                </div>

                {/* 3. Điều kiện & Số lượng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input 
                        label="Đơn tối thiểu (VND) *" 
                        type="number"
                        value={formData.minOrderValue}
                        onChange={(e) => handleChange('minOrderValue', e.target.value)}
                    />
                    <Input 
                        label="Số lượng mã *" 
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                    />
                </div>

                {/* 4. Thời gian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input 
                        label="Ngày bắt đầu *" 
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                    <Input 
                        label="Ngày kết thúc *" 
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 active:scale-95 transition-all shadow-md shadow-cyan-200 disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VoucherForm;