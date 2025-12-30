import logo from './images/logo.png';
import login_bg from './images/login-bg.jpg';
import { Fish, List, ListOrdered, ShoppingCart } from 'lucide-react';

export const assets = {
    logo,
    login_bg
}

export const SIDE_BAR_USER = [
    {
        id: '01',
        label: 'Product',
        icon: Fish,
        path: '/product',
    },
    {
        id: '02',
        label: 'Category',
        icon: List,
        path: '/category',
    },
    {
        id: '03',
        label: 'Cart',
        icon: ShoppingCart,
        path: '/cart',
    },
    {
        id: '04',
        label: 'Order',
        icon: ListOrdered,
        path: '/order',
    },
    //còn thiếu ServiceType, Employee, Appointment
]

export const SIDE_BAR_ADMIN = [
    {
        id: '01',
        label: 'ProductAdmin',
        icon: Fish,
        path: '/productAdmin',
    },
    {
        id: '02',
        label: 'CategoryAdmin',
        icon: List,
        path: '/categoryAdmin',
    },
    {
        id: '03',
        label: 'OrderAdmin',
        icon: ListOrdered,
        path: '/orderAdmin',
    },
]