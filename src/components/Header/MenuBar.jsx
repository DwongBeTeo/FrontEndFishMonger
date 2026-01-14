import { LogOut, Menu, User, X } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import Sidebar from '../Sidebar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import LogoSection from './LogoSection';
import DesktopNav from './DesktopNav';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';
import CartWidget from './CartWidget';
// Đã bỏ import Input từ react-select vì không cần thiết và gây lỗi giao diện

const MenuBar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="w-full flex justify-center">
        <div className="px-5 md:px-10 lg:px-20 flex w-full max-w-[1440px] items-center justify-between py-4">
          
          {/* 1. Logo Section */}
          <LogoSection openSideMenu={openSideMenu} setOpenSideMenu={setOpenSideMenu} />

          {/* 2. Desktop Navigation */}
          <DesktopNav />

          {/* 3. Right Actions (Search + Cart + UserMenu) */}
          <div className="flex items-center gap-6">
            
            {/* Search Bar */}
            <SearchBar />

            <div className="flex items-center gap-3">
                {/* Mobile Search Button */}
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 transition-colors lg:hidden text-gray-600">
                  <span className="material-symbols-outlined">search</span>
                </button>

                {/* Cart Button */}
                <CartWidget />

                {/* User Menu Component */}
                <UserMenu />
            </div>
          </div>

          {/* 4. Mobile side menu */}
          {openSideMenu && (
            <div className="fixed left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 top-[73px]">
              <Sidebar />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MenuBar;