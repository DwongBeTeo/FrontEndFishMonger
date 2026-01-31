import React, { useContext, useState, useEffect } from 'react'; 
import { CartContext } from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import axiosConfig from '../../util/axiosConfig';
import AddressForm from '../../components/checkout/AddressForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import ReviewStep from '../../components/checkout/ReviewStep';
import BANK_INFO from '../../util/bankConfig';
// 1. IMPORT VoucherSelector
import VoucherSelector from '../../components/user/voucher/VoucherSelector';

const CheckoutPage = () => {
    const { cart, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    // --- STATE ---
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        recipientName: '',
        phoneNumber: '',
        shippingAddress: '',
        paymentMethod: 'COD'
    });
    
    // 2. STATE QUẢN LÝ VOUCHER & TIỀN
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [cartTotal, setCartTotal] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);

    const [orderSuccess, setOrderSuccess] = useState(null);
    const steps = ['Địa chỉ giao hàng', 'Thanh toán', 'Xác nhận'];

    // --- EFFECT ---
    // Auto-fill user info
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                recipientName: user.fullName || '',
                phoneNumber: user.phoneNumber || ''
            }));
        }
    }, [user]);

    // Cập nhật tổng tiền khi cart thay đổi
    useEffect(() => {
        if (cart) {
            setCartTotal(cart.totalAmount);
            setFinalTotal(cart.totalAmount); 
        }
    }, [cart]);

    // Tính lại finalTotal khi voucher thay đổi
    useEffect(() => {
        if (appliedVoucher) {
            const discount = appliedVoucher.discountAmount || 0;
            const newTotal = Math.max(0, cartTotal - discount);
            setFinalTotal(newTotal);
        } else {
            setFinalTotal(cartTotal);
        }
    }, [appliedVoucher, cartTotal]);

    // --- HANDLERS ---
    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    // 3. Callback khi user chọn voucher
    const handleApplyVoucher = (voucherData) => {
        setAppliedVoucher(voucherData);
    };

    const handlePlaceOrder = async () => {
        try {
            const payload = {
                recipientName: formData.recipientName,
                phoneNumber: formData.phoneNumber,
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod,
                // 4. Gửi mã Voucher
                voucherCode: appliedVoucher ? appliedVoucher.code : null 
            };

            const res = await axiosConfig.post('/order/checkout', payload);

            setOrderSuccess(res.data);
            fetchCart(); 
            handleNext(); 
        } catch (error) {
            alert("Đặt hàng thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
        }
    };

    if ((!cart || cart.items.length === 0) && !orderSuccess) {
        return <div className="text-center py-20 text-gray-500 text-xl">Giỏ hàng trống.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* STEPPER UI */}
            <div className="flex items-center justify-between mb-10 relative px-4">
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                {steps.map((label, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    return (
                        <div key={index} className="flex flex-col items-center bg-white px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all 
                                ${isActive ? 'bg-cyan-600 scale-110 ring-4 ring-cyan-100' : isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <span className={`text-xs md:text-sm mt-2 font-medium ${isActive ? 'text-cyan-700' : 'text-gray-500'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* CONTENT AREA */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-gray-100 min-h-[400px]">
                {activeStep === 0 && (
                    <AddressForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        user={user} 
                        onNext={handleNext} 
                    />
                )}
                
                {activeStep === 1 && (
                    // --- SỬA LAYOUT ĐỂ CHÈN VOUCHER ---
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cột Trái: Chọn phương thức thanh toán */}
                        <div>
                            <PaymentForm 
                                formData={formData} 
                                setFormData={setFormData} 
                                onBack={handleBack} 
                                // Tắt nút đặt hàng mặc định của PaymentForm bằng cách không truyền onPlaceOrder hoặc xử lý ẩn trong PaymentForm (Tùy bạn)
                                // Tuy nhiên, vì code PaymentForm bạn gửi CÓ nút đặt hàng bên trong, 
                                // nên tạm thời ta cứ để nó ở đó nhưng ta sẽ ẩn nó đi bằng CSS hoặc sửa nhẹ PaymentForm.
                                // Cách tốt nhất ở đây là ta tự render nút ở ngoài (cột phải)
                                onPlaceOrder={() => {}} 
                                totalAmount={finalTotal} // Truyền giá đã giảm để hiển thị (nếu PaymentForm có hiển thị)
                                hideButtons={true}
                            />
                            {/* Nút Quay lại (Render thủ công để thay thế nút trong PaymentForm nếu cần) */}
                            <button onClick={handleBack} className="mt-4 text-gray-600 hover:underline">
                                &larr; Quay lại
                            </button>
                        </div>

                        {/* Cột Phải: Tổng kết & Voucher (MỚI) */}
                        <div className="flex flex-col gap-4 border-l pl-8 border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg">Tổng cộng</h3>
                            
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tạm tính:</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</span>
                            </div>

                            {/* 5. Component Chọn Voucher */}
                            <VoucherSelector 
                                totalAmount={cartTotal} 
                                onApplyVoucher={handleApplyVoucher} 
                            />

                            {/* Hiển thị giảm giá */}
                            {appliedVoucher && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Voucher giảm giá:</span>
                                    <span>-{new Intl.NumberFormat('vi-VN').format(appliedVoucher.discountAmount)}đ</span>
                                </div>
                            )}

                            <div className="border-t pt-4 mt-2 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Thành tiền:</span>
                                <span className="text-2xl font-bold text-cyan-600">
                                    {new Intl.NumberFormat('vi-VN').format(finalTotal)}đ
                                </span>
                            </div>

                            {/* Action Button (Nút Đặt hàng chính thức) */}
                            <button 
                                onClick={handlePlaceOrder}
                                className="w-full bg-cyan-600 text-white py-3 rounded-lg font-bold hover:bg-cyan-700 transition-all shadow-md mt-4"
                            >
                                XÁC NHẬN ĐẶT HÀNG
                            </button>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <ReviewStep 
                        orderSuccess={orderSuccess} 
                        bankInfo={BANK_INFO} 
                    />
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;