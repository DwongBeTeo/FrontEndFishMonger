import React from 'react';
import { Fish } from 'lucide-react';
const About = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 font-bold text-xl">
                <Fish size={28} />
                <span>FishSeller</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
                Chuyên cung cấp các loại cá cảnh đẹp, phụ kiện thủy sinh và kiến thức chăm sóc cá hàng đầu. Mang thiên nhiên vào không gian sống của bạn.
            </p>
        </div>
    );
};

export default About;