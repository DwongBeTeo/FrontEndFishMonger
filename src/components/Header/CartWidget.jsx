import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import Swal from 'sweetalert2';
import AuthContext from '../../context/AuthContext';

const CartWidget = () => {
  const { totalItems } = useContext(CartContext);
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCart = () => {
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
    });}else {
        navigate('/cart');
    }
  }
  return (
    <button 
        onClick={handleCart} 
        className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
    >
        <span className="material-symbols-outlined">shopping_cart</span>
        {totalItems > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                {totalItems}
            </span>
        )}
    </button>
  );
};

export default CartWidget;