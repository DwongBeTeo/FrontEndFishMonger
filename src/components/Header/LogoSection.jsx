import React from 'react';
import { Menu, X } from 'lucide-react'; // Hoặc import icon của bạn

const LogoSection = ({ openSideMenu, setOpenSideMenu }) => {
  return (
    <div className="flex items-center gap-4 cursor-pointer">
      {/* Nút Hamburger cho Mobile */}
      <button 
        onClick={() => setOpenSideMenu(!openSideMenu)}
        className="block md:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
      >
        {openSideMenu ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
      </button>

      {/* Logo + Tên Shop */}
      <div className="flex items-center gap-2">
        <div className="size-8 text-cyan-500 flex items-center justify-center">
          <span className="material-symbols-outlined !text-[36px]">water_drop</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
          Cá Cảnh Shop
        </h2>
      </div>
    </div>
  );
};

export default LogoSection;