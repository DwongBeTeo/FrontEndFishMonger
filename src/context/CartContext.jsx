import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../util/axiosConfig';
import AuthContext from './AuthContext'
import { API_ENDPOINTS } from '../util/apiEndpoints';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
// Bộ não quản lý giỏ hàng
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Lấy user từ AuthContext
    const [cart, setCart] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const navigate = useNavigate();

    // 1. Hàm lấy giỏ hàng từ Backend
    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            setTotalItems(0);
            return;
        }
        try {
            const res = await axiosConfig.get(API_ENDPOINTS.GET_CART);
            setCart(res.data);
            // Tính tổng số lượng sản phẩm để hiện lên Badge (nếu muốn tính tổng quantity)
            // Hoặc chỉ đếm số dòng items: res.data.items.length
            const count = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
            setTotalItems(count);
        } catch (error) {
            console.error("Lỗi tải giỏ hàng:", error);
        }
    };

    // Gọi fetchCart khi user thay đổi (đăng nhập/đăng xuất)
    useEffect(() => {
        fetchCart();
    }, [user]);

    // 2. Hàm thêm vào giỏ (Logic bắt buộc đăng nhập)
    const addToCart = async (productId, quantity = 1) => {
        // 1. Kiểm tra đăng nhập
        if (!user) {
            Swal.fire({
                title: 'Yêu cầu đăng nhập',
                text: "Bạn cần đăng nhập để thực hiện mua hàng.",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#0891b2', // Màu cyan chủ đạo
                cancelButtonColor: '#71717a',
                confirmButtonText: 'Đăng nhập ngay',
                cancelButtonText: 'Để sau'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        // 2. Kiểm tra quyền Admin
        if (user.role === 'ADMIN') {
            Swal.fire({
                icon: 'warning',
                title: 'Thao tác không được phép',
                text: 'Tài khoản Quản trị viên không được phép đặt hàng!',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        try {
            await axiosConfig.post(API_ENDPOINTS.ADD_TO_CART, { productId, quantity });
            fetchCart(); // Cập nhật lại số lượng trên Header

            // 3. Thành công -> Hiện thông báo dạng Toast nhỏ ở góc (Không chặn màn hình)
            Swal.fire({
                toast: true,
                position: 'top-end', // Góc trên phải
                icon: 'success',
                title: 'Đã thêm vào giỏ hàng!',
                showConfirmButton: false,
                timer: 1500, // Tự tắt sau 1.5s
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });

        } catch (error) {
            console.error("Lỗi thêm giỏ hàng:", error);
            
            // 4. Lỗi -> Hiện Popup báo lỗi
            Swal.fire({
                icon: 'error',
                title: 'Không thể thêm sản phẩm',
                text: error.response?.data?.message || "Đã xảy ra lỗi kết nối.",
                confirmButtonColor: '#d33'
            });
        }
    };

    // 3. Hàm cập nhật số lượng
    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_QUANTITY(cartItemId), null, {
                params: { quantity: newQuantity }
            });
            fetchCart();
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert(error.response?.data?.message || "Không thể cập nhật số lượng");
        }
    };

    // 4. Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (cartItemId) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.REMOVE_ITEM(cartItemId));
            fetchCart();
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
        }
    };

    // 5. Hàm xóa sạch giỏ (sau khi Checkout)
    const clearCartLocal = () => {
        setCart(null);
        setTotalItems(0);
    };

    const contextValue = { cart, totalItems, addToCart, updateQuantity, removeFromCart, fetchCart, clearCartLocal };
    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};