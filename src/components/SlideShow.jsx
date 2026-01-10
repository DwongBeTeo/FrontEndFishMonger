import React, { useEffect } from 'react';
import slide from "../util/slide";
import { assets } from '../assets/asset';

const SlideShow = () => {

    // 2. Gọi logic trong useEffect
    useEffect(() => {
        // Hàm này sẽ chạy sau khi HTML đã được render
        const cleanup = slide(); 
        
        // Dọn dẹp khi component bị hủy (ví dụ: chuyển trang)
        return () => {
            if (cleanup) cleanup();
        }
    }, []); // [] nghĩa là chỉ chạy 1 lần khi load trang

    return (
        <>
        <div className="slider w-full h-[500px] overflow-hidden relative group">
            <div className="list flex w-full h-full relative transition-all duration-500 ease-in-out">
                {/* Item: Bắt buộc phải full width và KHÔNG được co lại (shrink-0) */}
                <div className="item w-full flex-shrink-0 h-full">
                    <img src={assets.slider1} alt="Anh1" className="w-full h-full object-cover" />
                </div>
                
                <div className="item w-full flex-shrink-0 h-full">
                    <img src={assets.slider2} alt="Anh2" className="w-full h-full object-cover" />
                </div>
                
                <div className="item w-full flex-shrink-0 h-full">
                    <img src={assets.slider3} alt="Anh3" className="w-full h-full object-cover" />
                </div>
            </div>
            {/* button pre and next  */}
            <div className="buttons absolute top-1/2 left-0 w-full flex justify-between px-5 -translate-y-1/2 z-10">
                <button id="prev" className="w-10 h-10 rounded-full bg-gray-100/50 hover:bg-white text-black font-bold">&lt;</button>
                <button id="next" className="w-10 h-10 rounded-full bg-gray-100/50 hover:bg-white text-black font-bold">&gt;</button>
            </div>
            {/* Dot */}
            <ul className="dots">
                <li className="active"></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        </>
    )
}
export default SlideShow;