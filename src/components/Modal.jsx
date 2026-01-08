import { X } from "lucide-react";
import { useRef } from "react";
import { useClickOutside } from "../hook/useClickOutside";

export const Modal = ({isOpen, onClose, children, title}) => {
    const formRef = useRef(null);
    useClickOutside(formRef,onClose);

    if(!isOpen) return null;
    return (
        // form thêm mới (form nổi bọt)
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-hidden bg-black/40 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-2xl max-h-[90vh] h-full flex">
                {/* Modal header */}
                <div ref={formRef} className="flex flex-col h-full overflow-hidden relative bg-white rounded-xl shadow-2xl border border-gray-100">
                    {/* Modal content */}
                    <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 rounded-t-xl">
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
                    <div className="flex-1 min-h-0 bg-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};