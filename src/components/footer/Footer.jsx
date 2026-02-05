import React from 'react';
import About from './About';
import QuickLinks from './QuickLinks';
import ContactInfo from './ContactInfo';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            {/* Phần nội dung chính (3 Cột) */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <About />
                    <QuickLinks />
                    <ContactInfo />
                </div>
            </div>

            {/* Phần Credits (Dòng chữ yêu cầu) */}
            <div className="bg-gray-900 text-white py-4 text-center">
                <div className="container mx-auto px-4">
                    <p className="text-xs md:text-sm font-medium opacity-80">
                        Dự án được tạo bởi Trần Đăng Dương. 221090097. Khoa CNTT&CDS. Lớp: K22CNT2
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;