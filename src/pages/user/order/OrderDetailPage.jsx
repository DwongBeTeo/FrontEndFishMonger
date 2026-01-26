import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../../../util/axiosConfig';
import toast from 'react-hot-toast';
import BANK_INFO from '../../../util/bankConfig';
import AuthContext from '../../../context/AuthContext';

// Trang này dùng cho cả USER và ADMIN để xem chi tiết đơn hàng
const OrderDetailPage = () => {
    const { orderId } = useParams(); // Lấy ID từ URL
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                // --- LOGIC QUAN TRỌNG Ở ĐÂY ---
                let apiUrl = `/order/${orderId}`; // Mặc định là API của User
                
                // Nếu user là ADMIN
                // Thì đổi sang gọi API của Admin
                if (user?.authorities?.some(auth => auth.authority === 'ADMIN') || user?.role === 'ADMIN') {
                     apiUrl = `/admin/order/${orderId}`;
                }

                const res = await axiosConfig.get(apiUrl);
                setOrder(res.data);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
                alert("Không tìm thấy đơn hàng hoặc bạn không có quyền xem!");
                
                // Điều hướng về đúng trang danh sách tùy theo role
                if (user?.role === 'ADMIN') {
                    navigate('/orderAdmin'); // (Nếu bạn chưa có route này thì để /admin/orders)
                } else {
                    navigate('/my-orders');
                }
            } finally {
                setLoading(false);
            }
        };

        // Chỉ gọi khi có user (đã load xong AuthContext)
        if (user) {
            fetchOrderDetail();
        }
    }, [orderId, navigate, user]);

    if (loading) return <div className="text-center py-20">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return null;

    // --- LOGIC TẠO MÃ QR ---
    // Chỉ tạo khi: Phương thức là BANKING và (Trạng thái thanh toán là UNPAID hoặc chưa có trường này)
    // Lưu ý: Backend của bạn cần trả về field paymentStatus, nếu chưa có thì tạm thời check status đơn hàng
    const showQR = order.paymentMethod === 'BANKING' && 
                   (order.paymentStatus === 'UNPAID' || !order.paymentStatus) && 
                   order.status === 'PENDING';

    const transferContent = `DH${order.id}`; 
    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.BANK_ID}-${BANK_INFO.ACCOUNT_NO}-${BANK_INFO.TEMPLATE}.png?amount=${order.totalAmount}&addInfo=${transferContent}&accountName=${encodeURIComponent(BANK_INFO.ACCOUNT_NAME)}`;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <button 
                onClick={() => {
                    if (user?.role === "ADMIN") {
                        navigate('/orderAdmin');
                    }else{
                        navigate('/my-orders');
                    }
                }} 
                className="text-gray-500 hover:text-cyan-600 mb-4 flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {user?.role==='ADMIN' ? 'Quay lại trang quản lý' : 'Quay lại danh sách'}
            </button>

            <h1 className="text-2xl font-bold mb-6 text-gray-800">Chi tiết đơn hàng #{order.id}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* --- CỘT TRÁI: THÔNG TIN SẢN PHẨM --- */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">Sản phẩm đã mua</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded border" />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                        <div className="flex justify-between mt-2 text-sm">
                                            <span className="text-gray-500">Số lượng: x{item.quantity}</span>
                                            <span className="font-semibold">{item.price.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <span className="font-bold text-gray-700">Tổng tiền:</span>
                            <span className="text-xl font-bold text-red-600">{order.totalAmount.toLocaleString()}đ</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">Thông tin nhận hàng</h2>
                        <div className="text-sm space-y-2 text-gray-700">
                            <p><span className="font-medium text-gray-500">Ngày đặt:</span> {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                            <p><span className="font-medium text-gray-500">Số điện thoại:</span> {order.phoneNumber}</p>
                            <p><span className="font-medium text-gray-500">Địa chỉ:</span> {order.shippingAddress}</p>
                            <p><span className="font-medium text-gray-500">Phương thức thanh toán:</span> {order.paymentMethod === 'BANKING' ? 'Chuyển khoản (QR)' : 'Tiền mặt (COD)'}</p>
                            <p><span className="font-medium text-gray-500">Trạng thái đơn:</span> {order.status}</p>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: QR CODE (Nếu cần thanh toán) --- */}
                <div className="md:col-span-1">
                    {showQR ? (
                        <div className="bg-white p-6 rounded-xl border-2 border-cyan-100 shadow-lg sticky top-24">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-bold text-cyan-700">THANH TOÁN ĐƠN HÀNG</h3>
                                <p className="text-xs text-orange-500 font-medium mt-1">Đơn hàng chưa được thanh toán</p>
                            </div>
                            
                            <img src={qrUrl} alt="QR Code" className="w-full h-auto rounded-lg border mb-4" />
                            
                            <div className="text-sm bg-gray-50 p-3 rounded space-y-2">
                                <p className="flex justify-between"><span>Ngân hàng:</span> <strong>{BANK_INFO.BANK_ID}</strong></p>
                                <p className="flex justify-between"><span>Số TK:</span> <strong>{BANK_INFO.ACCOUNT_NO}</strong></p>
                                <p className="flex justify-between"><span>Chủ TK:</span> <strong>{BANK_INFO.ACCOUNT_NAME}</strong></p>
                                <p className="flex justify-between"><span>Nội dung:</span> <strong className="text-blue-600">{transferContent}</strong></p>
                                <div className="text-center mt-2 text-xs text-gray-400">
                                    Vui lòng chuyển khoản đúng nội dung để hệ thống tự động xác nhận.
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Nếu đã thanh toán hoặc là COD
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                            <span className="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                            <h3 className="font-bold text-green-800">Đơn hàng hợp lệ</h3>
                            <p className="text-sm text-green-700 mt-2">
                                {order.paymentMethod === 'COD' 
                                    ? 'Vui lòng chuẩn bị tiền mặt khi nhận hàng.' 
                                    : 'Đơn hàng đã được thanh toán hoặc đang chờ xử lý.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;