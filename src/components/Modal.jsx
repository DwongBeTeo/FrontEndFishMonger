import { X } from "lucide-react";
import { useRef } from "react";
import { useClickOutside } from "../hook/useClickOutside";

// Thêm prop fitContent vào đây, mặc định là false để giữ nguyên giao diện cũ cho các form khác
export const Modal = ({ isOpen, onClose, children, title, fitContent = false }) => {
    const formRef = useRef(null);
    useClickOutside(formRef, onClose);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden bg-black/40 backdrop-blur-sm">
            {/* Thay đổi ở đây: 
                Nếu fitContent = true thì dùng 'h-auto' (tự co giãn theo nội dung).
                Nếu fitContent = false (mặc định) thì dùng 'h-full' (như cũ).
            */}
            <div className={`relative p-4 w-full max-w-2xl max-h-[90vh] flex ${fitContent ? 'h-auto' : 'h-full'}`}>
                
                {/* Thay đổi tương tự ở thẻ div bên trong */}
                <div 
                    ref={formRef} 
                    className={`flex flex-col overflow-hidden relative bg-white rounded-xl shadow-2xl border border-gray-100 w-full ${fitContent ? 'h-auto' : 'h-full'}`}
                >
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 rounded-t-xl shrink-0">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {title}
                        </h3>

                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 rounded-lg text-sm w-9 h-9 inline-flex items-center 
                        justify-center transition-color duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Modal body */}
                    {/* Thêm overflow-y-auto để nếu nội dung dài quá thì hiện thanh cuộn */}
                    <div className="flex-1 min-h-0 bg-white overflow-y-auto p-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};