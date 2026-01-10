// src/components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Nếu chỉ có 1 trang hoặc không có dữ liệu thì không hiện phân trang
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex justify-center items-center gap-2">
      {/* Nút Trước */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`px-4 py-2 border rounded transition-colors ${
          currentPage === 0 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white hover:bg-blue-50 text-gray-700'
        }`}
      >
        Trước
      </button>
      
      {/* Hiển thị số trang */}
      <span className="px-4 py-2 bg-blue-600 text-white rounded font-bold shadow-sm">
        Trang {currentPage + 1} / {totalPages}
      </span>

      {/* Nút Sau */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`px-4 py-2 border rounded transition-colors ${
          currentPage === totalPages - 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white hover:bg-blue-50 text-gray-700'
        }`}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;