// step3: review and qrcode payment
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewStep = ({ orderSuccess, bankInfo }) => {
    const navigate = useNavigate();
    // --- DEBUGGING CONSOLE LOGS ---
    useEffect(() => {
        console.group("ReviewStep Debugging");
        console.log("1. Received orderSuccess object:", orderSuccess);
        
        if (orderSuccess) {
            console.log("2. Payment Method in orderSuccess:", orderSuccess.paymentMethod);
            console.log("3. Type of paymentMethod:", typeof orderSuccess.paymentMethod);
            
            // Check strictly for the string 'BANKING'
            const isBanking = orderSuccess.paymentMethod === 'BANKING';
            console.log("4. Is Payment Method === 'BANKING'?", isBanking);

            // Check if bankInfo is populated correctly
            console.log("5. Bank Info:", bankInfo);
        } else {
            console.warn("orderSuccess is null or undefined!");
        }
        console.groupEnd();
    }, [orderSuccess, bankInfo]);

    if (!orderSuccess) return null;

    const transferContent = `DH${orderSuccess.id}`; 
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.BANK_ID}-${bankInfo.ACCOUNT_NO}-${bankInfo.TEMPLATE}.png?amount=${orderSuccess.totalAmount}&addInfo=${transferContent}&accountName=${encodeURIComponent(bankInfo.ACCOUNT_NAME)}`;

    return (
        <div className="text-center animate-fade-in-up">
            <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Đặt hàng thành công!</h2>
                <span>Vui lòng đợi 1 chút để tạo mã QR</span>
                <p className="text-gray-600 mt-1">Mã đơn hàng: <span className="font-bold text-black">#{orderSuccess.id}</span></p>
            </div>

            {orderSuccess.paymentMethod === 'BANKING' ? (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-sm mx-auto">
                    <h3 className="text-lg font-bold text-cyan-700 mb-2">QUÉT MÃ ĐỂ THANH TOÁN</h3>
                    <img src={qrUrl} alt="QR Code" className="w-full h-auto rounded-lg border mb-4" />
                    
                    <div className="text-left text-sm bg-gray-50 p-3 rounded space-y-1">
                        <p>Ngân hàng: <strong>{bankInfo.BANK_ID}</strong></p>
                        <p>Số TK: <strong>{bankInfo.ACCOUNT_NO}</strong></p>
                        <p>Chủ TK: <strong>{bankInfo.ACCOUNT_NAME}</strong></p>
                        <p>Số tiền: <strong className="text-red-500">{orderSuccess.totalAmount.toLocaleString()}đ</strong></p>
                        <p>Nội dung: <strong className="text-blue-600 copy-text">{transferContent}</strong></p>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto border border-gray-200">
                    <p className="text-gray-700 font-medium">Cảm ơn bạn đã mua hàng.</p>
                    <p className="text-sm text-gray-500 mt-2">Chúng tôi sẽ sớm liên hệ xác nhận đơn hàng.</p>
                </div>
            )}

            <div className="mt-8">
                <button onClick={() => navigate('/')} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-black transition-colors">
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default ReviewStep;