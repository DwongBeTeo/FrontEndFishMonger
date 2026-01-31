import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../../util/axiosConfig';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();


    // Hàm gọi API lấy danh sách
    const fetchOrders = async (search = '') => {
        setLoading(true);
        try {
            // Gọi API với tham số keyword
            const res = await axiosConfig.get('/admin/order', {
                params: { keyword: search }
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
            alert("Không thể tải danh sách đơn hàng.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi lần đầu
    useEffect(() => {
        fetchOrders();
    }, []);

    // Xử lý tìm kiếm (Debounce hoặc bấm nút)
    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders(keyword);
    };

    // --- HÀM 1: CẬP NHẬT TRẠNG THÁI ĐƠN (ĐÃ FIX) ---
    const handleStatusChange = async (orderId, newStatus) => {
        // 1. Tìm đơn hàng cũ để backup (đề phòng lỗi thì revert lại)
        const previousOrders = [...orders]; 
        
        // 2. CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC (Optimistic UI)
        // Việc này giúp cái thẻ Select không bị nhảy về giá trị cũ
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        try {
            // 3. Gọi API
            const url = `/admin/order/${orderId}/status`;
            
            // Axios PUT: tham số thứ 2 là body (null), tham số thứ 3 là config (params)
            const response = await axiosConfig.put(url, null, {
                params: { status: newStatus }
            });

            //4. QUAN TRỌNG: Cập nhật lại state bằng dữ liệu thật từ Server trả về
            // Lúc này response.data chứa OrderDTO mới nhất (đã có paymentStatus = PAID)
            const updatedOrder = response.data;
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? updatedOrder : order
            ));

            Toast.fire({
                icon: 'success',
                title: `Cập nhật trạng thái: ${newStatus}`
            });

            // Nếu thành công: Không cần làm gì thêm vì UI đã cập nhật ở bước 2 rồi
            // Hoặc nếu muốn chắc ăn thì fetch lại ngầm:
            // fetchOrders(keyword); 

        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            
            // 4. NẾU LỖI -> TRẢ LẠI TRẠNG THÁI CŨ
            setOrders(previousOrders);
            Swal.fire({
                icon: 'error',
                title: 'Cập nhật thất bại',
                text: error.response?.data?.message || error.message,
            });
        }
    };

    // --- HÀM 2: DUYỆT YÊU CẦU HỦY ---
    const handleReviewCancel = async (orderId, approve) => {
        let reason = "";
        if (!approve) {
            const { value: inputReason, isDismissed } = await Swal.fire({
                title: 'Từ chối hủy đơn?',
                input: 'textarea',
                inputLabel: 'Vui lòng nhập lý do từ chối',
                inputPlaceholder: 'Nhập lý do tại đây...',
                showCancelButton: true,
                confirmButtonText: 'Gửi từ chối',
                cancelButtonText: 'Hủy bỏ',
                confirmButtonColor: '#d33',
                inputValidator: (value) => { if (!value) return 'Bạn cần viết lý do!' }
            });
            if (isDismissed) return;
            reason = inputReason;
        } else {
            const result = await Swal.fire({
                title: 'Xác nhận hủy đơn?',
                text: "Bạn có chắc chắn muốn chấp thuận yêu cầu hủy đơn này?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý hủy',
                cancelButtonText: 'Suy nghĩ lại'
            });
            if (!result.isConfirmed) return;
        }

        try {
            // 1. Gọi API
            const response = await axiosConfig.put(`/admin/order/${orderId}/review-cancel`, null, {
                params: { approve, reason }
            });

            // 2. Cập nhật state cục bộ thay vì fetchOrders(keyword)
            const updatedOrder = response.data;
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? updatedOrder : order
            ));

            Toast.fire({
                icon: 'success',
                title: approve ? 'Đã duyệt hủy đơn hàng' : 'Đã từ chối yêu cầu hủy'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi xử lý',
                text: error.response?.data?.message || "Có lỗi xảy ra",
            });
        }
    };

    // Helper hiển thị badge màu sắc
    const getStatusBadge = (status) => {
        const colors = {
            PENDING: "bg-yellow-100 text-yellow-800",
            PREPARING: "bg-blue-100 text-blue-800",
            SHIPPING: "bg-indigo-100 text-indigo-800",
            COMPLETED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800"
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || "bg-gray-100"}`}>{status}</span>;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý Đơn hàng</h1>

            {/* --- THANH TÌM KIẾM --- */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                <input 
                    type="text" 
                    placeholder="Tìm theo email khách hàng..." 
                    className="flex-1 border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">
                    Tìm kiếm
                </button>
            </form>

            {/* --- BẢNG DANH SÁCH --- */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Ngày đặt</th>
                            <th className="px-6 py-3">Khách hàng</th>
                            <th className="px-6 py-3">Tổng Thanh toán</th>
                            <th className="px-6 py-3">Thanh toán</th>
                            <th className="px-6 py-3">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-4">Đang tải...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-4">Không tìm thấy đơn hàng nào.</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.userEmail}</span>
                                            <span className="text-xs text-gray-400">ID: {order.userId}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {/* Giá thực thu */}
                                            <span className="font-bold text-red-600">
                                                {(order.finalAmount ?? order.totalAmount).toLocaleString()}đ
                                            </span>

                                            {/* Nếu có giảm giá thì hiện chi tiết nhỏ bên dưới */}
                                            {order.discountAmount > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="line-through mr-1">{order.totalAmount?.toLocaleString()}</span>
                                                    <span className="text-green-600" title={`Mã: ${order.voucherCode}`}>
                                                        (-{order.discountAmount?.toLocaleString()})
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {/* Hiển thị mã voucher */}
                                            {order.voucherCode && (
                                                <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-1 rounded w-fit mt-1 border">
                                                    {order.voucherCode}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{order.paymentMethod}</span>
                                            <span className={`text-xs ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                                                {order.paymentStatus === 'PAID' ? 'Đã TT' : 'Chưa TT'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.status)}
                                        {order.cancellationRequested && (
                                            <div className="mt-1 text-xs text-red-500 font-bold animate-pulse">
                                                ! Yêu cầu hủy
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2 items-center">
                                            {/* Nút Xem chi tiết */}
                                            <button 
                                                onClick={() => navigate(`/order/${order.id}`)}
                                                className="text-gray-500 hover:text-cyan-600 flex items-center gap-1"
                                            >
                                                <Eye size={16} /> Xem
                                            </button>

                                            {/* LOGIC HÀNH ĐỘNG DỰA TRÊN TRẠNG THÁI */}
                                            
                                            {/* Case 1: Khách yêu cầu hủy -> Admin duyệt/từ chối */}
                                            {order.cancellationRequested ? (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleReviewCancel(order.id, true)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                                                    >
                                                        Duyệt Hủy
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReviewCancel(order.id, false)}
                                                        className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            ) : (
                                                /* Case 2: Đổi trạng thái bình thường */
                                                order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                                    <select 
                                                        className="border border-gray-300 rounded text-xs p-1 cursor-pointer"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    >
                                                        <option value="PENDING">Chờ xác nhận</option>
                                                        <option value="PREPARING">Đang chuẩn bị</option>
                                                        <option value="SHIPPING">Đang giao</option>
                                                        <option value="COMPLETED">Hoàn thành</option>
                                                        <option value="CANCELLED">Hủy đơn</option>
                                                    </select>
                                                )
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderAdmin;