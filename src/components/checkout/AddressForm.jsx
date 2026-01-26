// src/components/checkout/AddressForm.jsx (File cũ của bạn)
import React from 'react';
import Swal from 'sweetalert2';
import AddressSelector from '../common/AddressSelector';

const AddressForm = ({ formData, setFormData, user, onNext }) => {
    
    // Hàm chuyển đổi dữ liệu từ AddressSelector về format của Checkout
    const handleSelect = (addr) => {
        setFormData({
            ...formData,
            recipientName: addr.recipientName,
            phoneNumber: addr.phoneNumber,
            shippingAddress: addr.address // Mapping: address -> shippingAddress
        });
    };

    // Fake object để truyền vào prop selectedAddress
    const currentSelected = {
        recipientName: formData.recipientName,
        phoneNumber: formData.phoneNumber,
        address: formData.shippingAddress
    };

    const handleContinue = () => {
        if (!formData.shippingAddress) {
            Swal.fire('Lỗi', 'Vui lòng chọn địa chỉ', 'warning');
            return;
        }
        onNext();
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold border-b pb-2">Thông tin nhận hàng</h3>
            
            <AddressSelector 
                user={user}
                selectedAddress={currentSelected}
                onSelect={handleSelect}
            />

            <div className="flex justify-end mt-4 pt-4 border-t">
                <button 
                    onClick={handleContinue}
                    className="bg-cyan-600 text-white px-8 py-2.5 rounded hover:bg-cyan-700 font-bold shadow-md transition-transform active:scale-95"
                >
                    Tiếp tục đến thanh toán
                </button>
            </div>
        </div>
    );
};

export default AddressForm;