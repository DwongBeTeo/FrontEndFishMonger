import logo from './images/logo.png';
import login_bg from './images/login-bg.jpg';
import { Fish, List, ListOrdered, ShoppingCart } from 'lucide-react';

export const assets = {
    logo,
    login_bg
}

export const SIDE_BAR_DATA = [
    {
        id: '01',
        label: 'Product',
        icon: Fish,
        path: '/product',
    },
    {
        id: '02',
        label: 'ProductAdmin',
        icon: List,
        path: '/productAdmin',
    },
    {
        id: '03',
        label: 'Category',
        icon: List,
        path: '/category',
    },
    {
        id: '04',
        label: 'CategoryAdmin',
        icon: List,
        path: '/categoryAdmin',
    },
    {
        id: '05',
        label: 'Cart',
        icon: ShoppingCart,
        path: '/cart',
    },
    {
        id: '06',
        label: 'Order',
        icon: ListOrdered,
        path: '/order',
    },
    {
        id: '07',
        label: 'OrderAdmin',
        icon: List,
        path: '/orderAdmin',
    },
    //còn thiếu ServiceType, Employee, Appointment
]