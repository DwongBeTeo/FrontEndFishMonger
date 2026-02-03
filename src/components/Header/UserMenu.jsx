import React, { useState, useRef, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { User, LogOut, Package, Calendar, MapPin } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const UserMenu = () => {
    const { user, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    // Xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="relative" ref={dropDownRef}>
            {/* Icon User Avatar */}
            <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
            >
                <span className="material-symbols-outlined">account_circle</span>
            </button>

            {/* Dropdown Content */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                    {user ? (
                        // Đã đăng nhập
                        <>
                            {/* Header User info */}
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                                        {user.profileImageUrl ? (
                                            <img 
                                                src={user.profileImageUrl}
                                                alt="Avatar"
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-4 h-4 text-purple-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* MENU ITEM ĐƠN HÀNG */}
                            <div className="py-1 border-b border-gray-100">
                                <NavLink 
                                    to="/my-orders" 
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Package className="w-4 h-4 text-cyan-600" />
                                    <span>Đơn hàng của tôi</span>
                                </NavLink>
                            </div>

                            {/* MENU Appointment  */}
                            <div className="py-1 border-b border-gray-100">
                                <NavLink 
                                    to="/my-appointments" 
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Calendar className="w-4 h-4 text-cyan-600" />
                                    <span>Lịch hẹn của tôi</span>
                                </NavLink>
                            </div>

                            {/* MENU Address */}
                            <div className="py-1 border-b border-gray-100">
                                <NavLink 
                                    to="/my-addresses" 
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <MapPin className="w-4 h-4 text-cyan-600" />
                                    <span>Sổ địa chỉ của tôi</span>
                                </NavLink>
                            </div>

                            {/* MENU profile personal */}
                            <div className="py-1 border-b border-gray-100">
                                <NavLink 
                                    to="/my-profile" 
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-4 h-4 text-cyan-600" />
                                    <span>Thông tin cá nhân</span>
                                </NavLink>
                            </div>

                            {/* Log out */}
                            <div className="py-1">
                                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        // Chưa đăng nhập
                        <div className="p-4 flex flex-col gap-3">
                            <div className="text-center">
                                <p className="font-medium text-gray-900">Tài khoản</p>
                                <p className="text-xs text-gray-500 mt-1">Đăng nhập để xem thông tin</p>
                            </div>
                            <NavLink to="/login" className="flex items-center justify-center w-full py-2 px-4 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                                Đăng nhập
                            </NavLink>
                            <div className="text-xs text-center text-gray-500">
                                Chưa có tài khoản?{' '}
                                <NavLink to="/sign-up" className="text-black font-medium hover:underline">
                                    Đăng ký
                                </NavLink>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserMenu;