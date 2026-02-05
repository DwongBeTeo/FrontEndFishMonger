import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Nếu bạn muốn dùng icon thay vì chữ

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 1. Ẩn nếu chỉ có 1 trang
  if (totalPages <= 1) return null;

  // Chuyển đổi currentPage (0-based) sang (1-based) để hiển thị cho User
  const current = currentPage + 1;

  // 2. Thuật toán tạo danh sách trang (VD: [1, 2, '...', 9, 10])
  const generatePageNumbers = () => {
    const pages = [];
    
    // Nếu tổng trang ít (<= 7) -> Hiện tất cả (1 2 3 4 5 6 7)
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Nếu đang ở những trang đầu (VD: 1 2 3 4 5 ... 10)
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } 
    // Nếu đang ở những trang cuối (VD: 1 ... 6 7 8 9 10)
    else if (current >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } 
    // Nếu đang ở giữa (VD: 1 ... 4 5 6 ... 10)
    else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="mt-8 flex justify-center items-center gap-2 select-none">
      {/* Nút Trước (Previous) */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`h-9 px-3 rounded-lg border flex items-center justify-center transition-all ${
          currentPage === 0 
            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 shadow-sm'
        }`}
      >
        <ChevronLeft size={18} /> {/* Hoặc dùng chữ "Trước" */}
      </button>
      
      {/* Danh sách các số trang */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          // Render dấu ba chấm
          if (page === '...') {
            return (
              <span key={index} className="w-9 h-9 flex items-center justify-center text-gray-400">
                ...
              </span>
            );
          }

          // Render nút số
          return (
            <button
              key={index}
              onClick={() => onPageChange(page - 1)} // QUAN TRỌNG: Trừ 1 để trả về index 0 cho Backend
              className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-bold transition-all border shadow-sm ${
                page === current
                  ? 'bg-cyan-600 text-white border-cyan-600' // Style trang hiện tại
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-cyan-600 hover:border-cyan-200' // Style trang thường
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Nút Sau (Next) */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`h-9 px-3 rounded-lg border flex items-center justify-center transition-all ${
          currentPage === totalPages - 1 
            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 shadow-sm'
        }`}
      >
        <ChevronRight size={18} /> {/* Hoặc dùng chữ "Sau" */}
      </button>
    </div>
  );
};

export default Pagination;