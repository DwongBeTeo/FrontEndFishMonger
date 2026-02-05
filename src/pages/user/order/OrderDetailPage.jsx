import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosConfig from '../../../util/axiosConfig';
import BANK_INFO from '../../../util/bankConfig';
import AuthContext from '../../../context/AuthContext';
import SocketContext from '../../../context/SocketContext';
import Swal from 'sweetalert2';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { lastMessage } = useContext(SocketContext);

    // Helper: Map trạng thái sang màu sắc và text tiếng Việt
    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Chờ xác nhận</span>;
            case 'PREPARING':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Đang chuẩn bị</span>;
            case 'SHIPPING':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Đang giao hàng</span>;
            case 'COMPLETED':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Hoàn thành</span>;
            case 'CANCELLED':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Đã hủy</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    // ============================================================
    // FETCH đơn hàng khi mount hoặc khi orderId đổi
    // ============================================================
    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                let apiUrl = `/order/${orderId}`;
                if (user?.authorities?.some(auth => auth.authority === 'ADMIN') || user?.role === 'ADMIN') {
                    apiUrl = `/admin/order/${orderId}`;
                }
                const res = await axiosConfig.get(apiUrl);
                setOrder(res.data);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
                alert("Không tìm thấy đơn hàng hoặc bạn không có quyền xem!");
                if (user?.role === 'ADMIN') {
                    navigate('/orderAdmin');
                } else {
                    navigate('/my-orders');
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrderDetail();
        }
    }, [orderId, navigate, user]);

    // ============================================================
    // ✅ FIX: Lắng nghe WebSocket update — đây là phần quan trọng nhất
    // ============================================================
    useEffect(() => {
        // Guard: nếu chưa có lastMessage thì bỏ qua
        if (!lastMessage) {
            console.log("OrderDetailPage: lastMessage là null, bỏ qua.");
            return;
        }

        // Guard: chỉ xử lý type ORDER
        if (lastMessage.type !== 'ORDER') {
            console.log("OrderDetailPage: lastMessage.type =", lastMessage.type, "— không phải ORDER, bỏ qua.");
            return;
        }

        const updatedOrder = lastMessage.data;

        // ✅ DEBUG: Log để thấy mình đang so sánh gì với gì
        console.log("OrderDetailPage: Đang so sánh ID");
        console.log("  → updatedOrder.id =", updatedOrder.id, "| typeof:", typeof updatedOrder.id);
        console.log("  → orderId (URL param) =", orderId, "| typeof:", typeof orderId);
        console.log("  → Number(updatedOrder.id) =", Number(updatedOrder.id));
        console.log("  → Number(orderId) =", Number(orderId));
        console.log("  → Kết quả so sánh:", Number(updatedOrder.id) === Number(orderId));

        // ✅ So sánh — convert cả hai sang Number để tránh "1" !== 1
        if (Number(updatedOrder.id) === Number(orderId)) {
            console.log("✅ ID khớp! Cập nhật order state với status mới:", updatedOrder.status);

            // ✅ Spread để tạo object mới → React chắc chắn detect state change
            setOrder(prev => ({ ...prev, ...updatedOrder }));

            // Hiện toast Swal
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Trạng thái đã đổi: ${updatedOrder.status}`,
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            console.log("❌ ID không khớp — không cập nhật.");
        }

        // dependency: lastMessage thay đổi → effect chạy lại
        // orderId cũng cần ở đây vì nó dùng trong so sánh
    }, [lastMessage, orderId]);

    // ============================================================
    // RENDER
    // ============================================================
    if (loading) return <div className="text-center py-20">Đang tải chi tiết đơn hàng...</div>;
    if (!order) return null;

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
                    } else {
                        navigate('/my-orders');
                    }
                }}
                className="text-gray-500 hover:text-cyan-600 mb-4 flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {user?.role === 'ADMIN' ? 'Quay lại trang quản lý' : 'Quay lại danh sách'}
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
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Tạm tính:</span>
                                <span>{order.totalAmount?.toLocaleString()}đ</span>
                            </div>

                            {order.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">local_offer</span>
                                        Voucher ({order.voucherCode}):
                                    </span>
                                    <span>-{order.discountAmount?.toLocaleString()}đ</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-lg font-bold text-gray-800 border-t border-dashed pt-2 mt-2">
                                <span>Thành tiền:</span>
                                <span className="text-red-600">
                                    {(order.finalAmount ?? order.totalAmount).toLocaleString()}đ
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="font-semibold text-lg mb-4 border-b pb-2">Thông tin nhận hàng</h2>
                        <div className="text-sm space-y-2 text-gray-700">
                            <p><span className="font-medium text-gray-500">Ngày đặt:</span> {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                            <p><span className="font-medium text-gray-500">Số điện thoại:</span> {order.phoneNumber}</p>
                            <p><span className="font-medium text-gray-500">Địa chỉ:</span> {order.shippingAddress}</p>
                            <p><span className="font-medium text-gray-500">Phương thức thanh toán:</span> {order.paymentMethod === 'BANKING' ? 'Chuyển khoản (QR)' : 'Tiền mặt (COD)'}</p>
                            <p><span className="font-medium text-gray-500">Trạng thái đơn:</span> {getStatusBadge(order.status)}</p>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: QR CODE --- */}
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