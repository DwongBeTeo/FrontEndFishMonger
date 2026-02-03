import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axiosConfig from '../../util/axiosConfig';
import axios from 'axios';

const DesktopNav = () => {
    // State lưu danh sách danh mục
    const [categories, setCategories] = useState([]);

    const getLinkClass = ({ isActive }) => {
        const baseClass = "text-sm font-medium transition-colors duration-200";
        return isActive 
        ? `${baseClass} text-cyan-500 font-bold` 
        : `${baseClass} text-gray-500 hover:text-cyan-500`;
    };

    // Gọi API khi component được mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosConfig.get('categories/menu', {
                    params: {
                        type: 'FISH'
                    }
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

  return (
    <nav className="hidden md:flex items-center gap-10">
      <NavLink className={getLinkClass} to='/'>Trang chủ</NavLink>

        {/* --- DROPDOWN MENU --- */}
        <div className="group relative py-4"> 
            <NavLink className={getLinkClass} to="/product">
                Danh sách sản phẩm 
                <span className="ml-1 text-xs">▼</span>
            </NavLink>

            {/* Dropdown Content */}
            <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-md border border-gray-100 hidden group-hover:block animate-fade-in-up">
                <ul className="py-2">
                    {/* SỬA LẠI LOGIC LOOP: Map trực tiếp item, không map children nữa */}
                    {categories.length > 0 ? (
                        categories.map((item) => (
                            <li key={item.id}>
                                <NavLink 
                                    to={`/category/${item.slug}/${item.id}`}
                                    className="block px-4 py-2 text-sm text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 border-b border-gray-50 last:border-0"
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-sm text-gray-400">Đang tải...</li>
                    )}
                </ul>
            </div>
        </div>
        {/* --- DROPDOWN MENU END --- */}
      
      <NavLink className={getLinkClass} to={`/aquarium`}>
        Bể cá
      </NavLink>
      <NavLink className={getLinkClass} to={`/accessory`}>
        Phụ kiện
      </NavLink>
      <NavLink className={getLinkClass} to={`/blog`}>
        Kiến thức
      </NavLink>
      <NavLink className={getLinkClass} to={`/services`}>
        Dịch vụ
      </NavLink>
    </nav>
  );
};

export default DesktopNav;