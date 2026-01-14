import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  // Xử lý khi nhấn phím
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (keyword.trim()) {
      // Chuyển hướng sang trang /search với tham số keyword
      // Ví dụ: /search?keyword=cá koi
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      
      // (Tùy chọn) Reset ô tìm kiếm sau khi enter
      // setKeyword(''); 
    }
  };

  return (
    <div className="hidden lg:block relative w-[280px]">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 border-none text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all outline-none"
        placeholder="Tìm kiếm cá, bể, thức ăn..."
      />
      
      {/* Nút icon click để tìm kiếm */}
      <button 
        onClick={handleSearch}
        className="flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">
          search
        </span>
      </button>
    </div>
  );
};

export default SearchBar;