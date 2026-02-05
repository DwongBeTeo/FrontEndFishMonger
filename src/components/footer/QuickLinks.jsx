import React from 'react';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
    const links = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Sản phẩm', path: '/products' },
        { name: 'Kiến thức (Blog)', path: '/blog' },
        { name: 'Giới thiệu', path: '/about' },
    ];

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link 
                            to={link.path} 
                            className="text-sm text-gray-500 hover:text-cyan-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuickLinks;