import { LogOut, Menu, User, X } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../context/AuthContext';
import Sidebar from './Sidebar';
// Đã bỏ import Input từ react-select vì không cần thiết và gây lỗi giao diện

const MenuBar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropDownRef = useRef(null);
    const { user,logout } = useContext(AuthContext);

    const handleDropDown = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        if(showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="w-full flex justify-center">
          {/* Giới hạn chiều rộng giống layout mẫu */}
          <div className="px-5 md:px-10 lg:px-20 flex w-full max-w-[1440px] items-center justify-between py-4">
            
            {/* --- 1. Logo Section --- */}
            <div className="flex items-center gap-4 cursor-pointer">
              <button  
              onClick={() => setOpenSideMenu(!openSideMenu)}
              // md:hidden nghĩa là: ẩn nút này đi khi màn hình <= 768px
              className="block md:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
              >
                  {openSideMenu ? (
                      <X className="text-2xl" />
                  ) : (
                      <Menu className="text-2xl" />
                  )}
              </button>
              <div className="flex items-center gap-2">
                {/* Icon Giọt nước màu Xanh Cyan */}
                <div className="size-8 text-cyan-500 flex items-center justify-center">
                  <span className="material-symbols-outlined !text-[36px]">
                    water_drop
                  </span>
                </div>
                {/* Tên Shop màu Đen/Xám đậm */}
                <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
                  Cá Cảnh Shop
                </h2>
              </div>
            </div>

            {/* --- 2. Desktop Navigation Links --- */}
            <nav className="hidden md:flex items-center gap-10">
              <a
                className="text-sm font-bold text-gray-500 hover:text-cyan-500 transition-colors"
                href="#"
              >
                Trang chủ
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-cyan-500 transition-colors"
                href="#"
              >
                Cá cảnh
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-cyan-500 transition-colors"
                href="#"
              >
                Bể cá
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-cyan-500 transition-colors"
                href="#"
              >
                Phụ kiện
              </a>
              <a
                className="text-sm font-medium text-gray-500 hover:text-cyan-500 transition-colors"
                href="#"
              >
                Kiến thức
              </a>
            </nav>

            {/* --- 3. Right Actions (Search + Icons) --- */}
            <div className="flex items-center gap-6">
              
              {/* Search Bar - Đã sửa thành thẻ input thường để đúng màu xám nhạt */}
              <div className="hidden lg:block relative w-[280px]">
                <input
                  type="text"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 border-none text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none"
                  placeholder="Tìm kiếm cá, bể, thức ăn..."
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  search
                </span>
              </div>

              {/* Icons Group */}
              <div className="flex items-center gap-3">
                {/* Nút search cho mobile */}
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors lg:hidden text-gray-600">
                  <span className="material-symbols-outlined">search</span>
                </button>

                {/* Giỏ hàng */}
                <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors text-gray-900">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {/* Badge số lượng màu đỏ */}
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                    2
                  </span>
                </button>

                {/* User Icon */}
                <div className="relative" ref={dropDownRef}>
                  <button onClick={handleDropDown} className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors text-gray-900">
                      <span className="material-symbols-outlined">account_circle</span>
                  </button>

                  {/* Drop down User */}
                  {showDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                          {user ? (
                              // ------------------------------------------------
                              // TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP
                              // ------------------------------------------------
                              <>
                                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                      <div className="flex items-center gap-3">
                                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                                              <User className="w-4 h-4 text-purple-600" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="py-1">
                                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                          <LogOut className="w-4 h-4" />
                                          <span>Đăng xuất</span>
                                      </button>
                                  </div>
                              </>
                          ) : (
                              // ------------------------------------------------
                              // TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP (Giao diện Khách)
                              // ------------------------------------------------
                              <div className="p-4 flex flex-col gap-3">
                                  <div className="text-center">
                                      <p className="font-medium text-gray-900">Tài khoản</p>
                                      <p className="text-xs text-gray-500 mt-1">Đăng nhập để xem thông tin</p>
                                  </div>
                                  
                                  {/* Nút Đăng nhập nổi bật */}
                                  <a href="/login" className="flex items-center justify-center w-full py-2 px-4 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                                      Đăng nhập
                                  </a>

                                  {/* Dòng Đăng ký nhỏ bên dưới */}
                                  <div className="text-xs text-center text-gray-500">
                                      Chưa có tài khoản?{' '}
                                      <a href="/sign-up" className="text-black font-medium hover:underline">
                                          Đăng ký
                                      </a>
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
                </div>

              </div>
            </div>

            {/* --- 4. Mobile side menu --- */}
              {openSideMenu && (
                  <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px]">
                      <Sidebar/>
                  </div>
              )}
          </div>
      </div>
    </header>
  );
};

export default MenuBar;