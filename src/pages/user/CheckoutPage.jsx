import React, { useContext, useState, useEffect } from 'react'; // Nhớ import useEffect
import { CartContext } from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import axiosConfig from '../../util/axiosConfig';
import AddressForm from '../../components/checkout/AddressForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import ReviewStep from '../../components/checkout/ReviewStep';
import BANK_INFO from '../../util/bankConfig';

const CheckoutPage = () => {
    const { cart, fetchCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    // --- STATE ---
    const [activeStep, setActiveStep] = useState(0);
    
    // 1. THÊM recipientName VÀO STATE
    const [formData, setFormData] = useState({
        recipientName: '', // Thêm dòng này
        phoneNumber: '',
        shippingAddress: '',
        paymentMethod: 'COD'
    });
    
    const [orderSuccess, setOrderSuccess] = useState(null);
    const steps = ['Địa chỉ giao hàng', 'Thanh toán', 'Xác nhận'];

    // --- 2. TỰ ĐỘNG ĐIỀN THÔNG TIN USER KHI LOAD TRANG ---
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                // Ưu tiên lấy fullName, nếu không có thì lấy username, không có nữa thì rỗng
                recipientName: user.fullName  || '', 
                // Nếu user có sđt thì điền luôn
                phoneNumber: user.phoneNumber || '' 
            }));
        }
    }, [user]);

    // --- HANDLERS ---
    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handlePlaceOrder = async () => {
        try {
            // Logic ghép địa chỉ nếu Backend OrderEntity chỉ có 1 trường shippingAddress
            // VD: "Anh A - 0988888888 - Số 1 Đại Cồ Việt"
            // Nếu Backend của bạn đã tách riêng cột recipientName thì gửi riêng.
            
            // Ở đây tôi giữ nguyên logic gửi riêng lẻ, nhưng lưu ý Backend phải hứng được
            const payload = {
                // Nếu OrderEntity không có cột name, bạn có thể ghép vào address:
                // shippingAddress: `${formData.recipientName} - ${formData.shippingAddress}`,
                
                recipientName: formData.recipientName, // Gửi thêm cái này (cần Backend hỗ trợ DTO)
                phoneNumber: formData.phoneNumber,
                shippingAddress: formData.shippingAddress,
                paymentMethod: formData.paymentMethod
            };

            const res = await axiosConfig.post('/order/checkout', payload);

            setOrderSuccess(res.data);
            fetchCart(); 
            handleNext(); 
        } catch (error) {
            alert("Đặt hàng thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
        }
    };

    // Kiểm tra giỏ hàng
    if ((!cart || cart.items.length === 0) && !orderSuccess) {
        return <div className="text-center py-20 text-gray-500 text-xl">Giỏ hàng trống.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* STEPPER UI GIỮ NGUYÊN */}
            <div className="flex items-center justify-between mb-10 relative px-4">
               {/* ... (Code stepper giữ nguyên như cũ) ... */}
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
                    <PaymentForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        onBack={handleBack} 
                        onPlaceOrder={handlePlaceOrder} 
                        totalAmount={cart?.totalAmount || 0}
                    />
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