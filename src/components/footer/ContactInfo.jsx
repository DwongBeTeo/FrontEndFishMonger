import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactInfo = () => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg">Liên hệ</h3>
            <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-gray-500">
                    <MapPin size={18} className="shrink-0 text-cyan-600" />
                    <span>Hà Nội, Việt Nam</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                    <Phone size={18} className="shrink-0 text-cyan-600" />
                    <span>0123 456 789</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500">
                    <Mail size={18} className="shrink-0 text-cyan-600" />
                    <span>contact@fishseller.com</span>
                </li>
            </ul>
        </div>
    );
};

export default ContactInfo;