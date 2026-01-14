// Step1: nhập địa chỉ
import React from 'react';
import Input from '../common/Input';
import Swal from 'sweetalert2';

const AddressForm = ({ formData, setFormData, user, onNext }) => {
    
    // Hàm validate đơn giản
    const handleContinue = () => {
        if (!formData.phoneNumber || !formData.shippingAddress) {
            Swal.fire({
                icon: 'warning', // Icon: error, warning, success, info
                title: 'Thiếu thông tin!',
                text: 'Vui lòng điền đầy đủ Số điện thoại và Địa chỉ nhận hàng.',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#0891b2', // Màu cyan-600 để đồng bộ giao diện
            });
            return;
        }
        onNext();
    };

    return (
        <div className="flex flex-col gap-2 animate-fade-in-up">
            <h3 className="text-lg font-semibold mb-2">Thông tin nhận hàng</h3>
            {/* Tên User (Disabled) */}
            <Input 
                label="Người nhận"
                value={user?.username || ''}
                // disabled={true} // Đã hoạt động nhờ update Input ở trên
                onChange={() => {}} 
            />

            {/* Số điện thoại */}
            <Input 
                label="Số điện thoại"
                placeholder="Nhập số điện thoại..."
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                type="number"
            />

            {/* Địa chỉ (Dùng multiline) */}
            <Input 
                label="Địa chỉ chi tiết"
                placeholder="Số nhà, đường, phường/xã..."
                value={formData.shippingAddress}
                onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                multiline={true} // Đã hoạt động nhờ update Input ở trên
            />

            <div className="flex justify-end mt-4">
                <button 
                    onClick={handleContinue}
                    className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700 font-medium"
                >
                    Tiếp tục đến thanh toán
                </button>
            </div>
        </div>
    );
};

export default AddressForm;