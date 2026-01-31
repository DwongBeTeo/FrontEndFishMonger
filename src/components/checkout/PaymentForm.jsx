// Step2: chọn phương thức thanh toán
import React from 'react';

const PaymentForm = ({ formData, setFormData, onBack, onPlaceOrder, totalAmount, hideButtons }) => {
    return (
        <div className="flex flex-col gap-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold">Chọn hình thức thanh toán</h3>
            
            {/* COD */}
            <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                <input 
                    type="radio" name="payment" value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => setFormData({...formData, paymentMethod: 'COD'})}
                    className="w-5 h-5 text-cyan-600 accent-cyan-600"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-gray-500">Bạn chỉ phải thanh toán khi đã nhận được hàng.</span>
                </div>
            </label>

            {/* Banking */}
            <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'BANKING' ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                <input 
                    type="radio" name="payment" value="BANKING"
                    checked={formData.paymentMethod === 'BANKING'}
                    onChange={() => setFormData({...formData, paymentMethod: 'BANKING'})}
                    className="w-5 h-5 text-cyan-600 accent-cyan-600"
                />
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">Chuyển khoản ngân hàng (Quét QR)</span>
                    <span className="text-sm text-gray-500">Hỗ trợ VietQR tất cả ngân hàng.</span>
                </div>
            </label>

            {!hideButtons &&(
                <div className="flex justify-between mt-6">
                    <button onClick={onBack} className="text-gray-600 hover:underline px-4">Quay lại</button>
                    <button 
                        onClick={onPlaceOrder} 
                        className="bg-cyan-600 text-white px-8 py-2 rounded hover:bg-cyan-700 font-bold shadow-md"
                    >
                        XÁC NHẬN ĐẶT HÀNG ({totalAmount?.toLocaleString()}đ)
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;