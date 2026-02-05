import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosConfig from '../../../util/axiosConfig';
import SocketContext from '../../../context/SocketContext';
import { useContext } from 'react';
import Pagination from '../../../components/common/Pagination';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { lastMessage } = useContext(SocketContext);

    // Hàm gọi API lấy danh sách đơn hàng của user
    const fetchOrders = async () => {
        try {
            const response = await axiosConfig.get('/order', {
                params: {
                    page: page,
                    size: 1
                }
            });
            const resData = response.data;
            setOrders(resData.content || []);
            setTotalPages(resData?.page?.totalPages || 0);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]); //Thêm dependency [page] để khi bấm chuyển trang thì gọi lại API

    useEffect(() => {
        if (lastMessage?.type === 'ORDER') {
            const updatedOrder = lastMessage.data;
            console.log("Socket nhận tin nhắn cho danh sách đơn hàng:", updatedOrder);

            // Kiểm tra xem đơn hàng này có nằm trong danh sách đang hiển thị không
            setOrders(prevOrders => {
                const isExist = prevOrders.find(o => o.id === updatedOrder.id);
                if (!isExist) return prevOrders; // Nếu không có trong danh sách thì thôi

                // Nếu có, tiến hành cập nhật "nóng" vào mảng
                return prevOrders.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
                );
            });

            // Hiển thị thông báo nhỏ
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Đơn hàng #${updatedOrder.id}: ${updatedOrder.status}`,
                timer: 4000,
                showConfirmButton: false
            });
        }
    }, [lastMessage]);

    // Hàm xử lý huỷ đơn
    const handleCancelOrder = async (orderId) => {
        // 1. Hiển thị Popup xác nhận
        const result = await Swal.fire({
            title: 'Xác nhận hủy đơn?',
            text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', 
            confirmButtonText: 'Đúng, hủy đơn!',
            cancelButtonText: 'Không, giữ lại'
        });

        // Nếu người dùng bấm "Không" hoặc click ra ngoài -> Dừng hàm
        if (!result.isConfirmed) {
            return;
        }

        try {
            // Gọi API Backend
            const response = await axiosConfig.put(`/order/${orderId}/cancel`);
            
            // 2. Xử lý phản hồi thành công
            if (response.data.status === 'CANCELLED') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Đã hủy thành công!',
                    text: 'Đơn hàng của bạn đã được hủy.',
                    confirmButtonColor: '#0891b2' // Màu chủ đạo (Cyan)
                });
            } else if (response.data.cancellationRequested) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Đã gửi yêu cầu',
                    text: 'Yêu cầu hủy đã được gửi tới Shop để xem xét.',
                    confirmButtonColor: '#0891b2'
                });
            }

            // Load lại danh sách
            fetchOrders(); 

        } catch (error) {
            console.error("Lỗi hủy đơn:", error);
            
            // 3. Xử lý lỗi
            const msg = error.response?.data?.message || "Có lỗi xảy ra khi hủy đơn";
            Swal.fire({
                icon: 'error',
                title: 'Hủy thất bại',
                text: msg,
                confirmButtonColor: '#d33'
            });
        }
    };

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

    if (loading) return <div className="text-center py-20">Đang tải lịch sử đơn hàng...</div>;

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Đơn hàng của tôi</h1>

            {orders.length === 0 ? (
                <div className="text-center bg-gray-50 rounded-lg py-12">
                    <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
                    <button onClick={() => navigate('/product')} className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
                            {/* Header đơn hàng */}
                            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Mã đơn hàng: <span className="font-bold text-black">#{order.id}</span></p>
                                    <p className="text-xs text-gray-400 mt-1">Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(order.status)}
                                    <div className="mt-2 flex flex-col items-end">
                                    {/* Nếu có giảm giá thì hiện giá gốc bị gạch ngang */}
                                    {order.discountAmount > 0 && (
                                        <span className="text-xs text-gray-400 line-through mr-1">
                                            {order.totalAmount?.toLocaleString()}đ
                                        </span>
                                    )}
                                    
                                    {/* Luôn hiện giá Final */}
                                    <span className="text-red-500 font-bold text-lg">
                                        {(order.finalAmount ?? order.totalAmount).toLocaleString()}đ
                                    </span>

                                    {/* Badge nhỏ báo hiệu voucher */}
                                    {order.voucherCode && (
                                        <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded mt-1">
                                            Voucher: {order.voucherCode}
                                        </span>
                                    )}
                                </div>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm rút gọn (Chỉ hiện 2 sản phẩm đầu) */}
                            <div className="space-y-3">
                                {order.orderItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded border" />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.productName}</h4>
                                            <div className="flex justify-between mt-1 text-sm text-gray-500">
                                                <span>x{item.quantity}</span>
                                                <span>{item.price.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions Button */}
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                {/* nút hủy đơn hàng */}
                                {(order.status === 'PREPARING' || order.status === 'SHIPPING' || order.status === 'PENDING') && (
                                    <>
                                        {order.cancellationRequested ? (
                                            <span className="px-4 py-2 text-sm text-orange-600 bg-orange-50 rounded cursor-not-allowed">
                                                Đang chờ duyệt hủy...
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="px-4 py-2 text-sm border border-orange-200 text-orange-600 rounded hover:bg-orange-50 transition-colors"
                                            >
                                                Yêu cầu hủy đơn
                                            </button>
                                        )}
                                    </>
                                )}
                                <button 
                                    onClick={() => navigate(`/order/${order.id}`)}
                                    className="px-4 py-2 text-sm bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Pagination */}
            <Pagination 
                currentPage={page}
                totalPages={totalPages} 
                onPageChange={setPage} 
            />
        </div>
    );
};

export default MyOrdersPage;