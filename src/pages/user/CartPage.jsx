import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
// import { formatCurrency } from '../util/formatCurrency'; // Hàm format tiền VND nếu bạn có

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300">remove_shopping_cart</span>
                <h2 className="text-2xl font-bold text-gray-700 mt-4">Giỏ hàng trống</h2>
                <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                <Link to="/product" className="bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-cyan-600">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- DANH SÁCH SẢN PHẨM (Chiếm 2 phần) --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cart.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">{item.productName}</h3>
                                                <p className="text-xs text-red-500 mt-1">Kho còn: {item.productStock}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                                            {item.price.toLocaleString()}đ
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center border rounded-md w-fit mx-auto">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                                > - </button>
                                                <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                                                > + </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                                            {item.subTotal.toLocaleString()}đ
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- TỔNG TIỀN VÀ NÚT THANH TOÁN (Chiếm 1 phần) --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Tổng quan đơn hàng</h2>
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Tạm tính:</span>
                            <span>{cart.totalAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Phí vận chuyển:</span>
                            <span>Miễn phí(có thể call api ở ngoài để tính phí vận chuyển)</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between items-center mb-6">
                            <span className="text-lg font-bold">Tổng cộng:</span>
                            <span className="text-xl font-bold text-red-500">{cart.totalAmount.toLocaleString()}đ</span>
                        </div>
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors uppercase"
                        >
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;