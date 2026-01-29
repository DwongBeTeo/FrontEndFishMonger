import React, { useState } from 'react';
import Swal from 'sweetalert2';
import AddressSelector from '../common/AddressSelector';
import Input from '../common/Input';

const AddressForm = ({ formData, setFormData, user, onNext }) => {
    // Luồng: 'saved' (chọn từ sổ) hoặc 'manual' (nhập tay)
    const [addressMode, setAddressMode] = useState('saved'); 

    const handleSelectFromBook = (addr) => {
        setFormData({
            ...formData,
            recipientName: addr.recipientName,
            phoneNumber: addr.phoneNumber,
            shippingAddress: addr.address
        });
    };

    const handleManualChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold border-b pb-2">Thông tin nhận hàng</h3>
            
            {/* Tab chuyển đổi */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                <button 
                    onClick={() => setAddressMode('saved')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${addressMode === 'saved' ? 'bg-white shadow text-cyan-600' : 'text-gray-500'}`}
                >
                    Địa chỉ đã lưu
                </button>
                <button 
                    onClick={() => setAddressMode('manual')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${addressMode === 'manual' ? 'bg-white shadow text-cyan-600' : 'text-gray-500'}`}
                >
                    Địa chỉ giao hàng
                </button>
            </div>

            {addressMode === 'saved' ? (
                <AddressSelector 
                    user={user}
                    onSelect={handleSelectFromBook}
                    selectedAddress={{
                        recipientName: formData.recipientName,
                        phoneNumber: formData.phoneNumber,
                        address: formData.shippingAddress
                    }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <div className="md:col-span-1">
                        <Input 
                            label="Tên người nhận" 
                            value={formData.recipientName} 
                            onChange={(e) => handleManualChange('recipientName', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <Input 
                            label="Số điện thoại" 
                            value={formData.phoneNumber}
                            onChange={(e) => handleManualChange('phoneNumber', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Input 
                            label="Địa chỉ giao hàng chi tiết" 
                            multiline 
                            value={formData.shippingAddress}
                            onChange={(e) => handleManualChange('shippingAddress', e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-end mt-4 pt-4 border-t">
                <button 
                    onClick={() => formData.shippingAddress ? onNext() : Swal.fire('Lỗi', 'Vui lòng cung cấp địa chỉ', 'warning')}
                    className="bg-cyan-600 text-white px-8 py-2.5 rounded hover:bg-cyan-700 font-bold shadow-md transition-transform active:scale-95"
                >
                    Tiếp tục đến thanh toán
                </button>
            </div>
        </div>
    );
};

export default AddressForm;