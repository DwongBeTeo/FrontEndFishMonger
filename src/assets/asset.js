import logo from './images/logo.png';
import login_bg from './images/login-bg.jpg';
import slider1 from './images/slider1.jpg';
import slider2 from './images/slider2.jpg';
import slider3 from './images/slider3.jpg';
import { Calendar, Fish, Home, IdCardLanyard, List, ListOrdered, ShoppingCart, Toolbox } from 'lucide-react';

export const assets = {
    logo,
    login_bg,
    slider1,
    slider2,
    slider3,
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
    {
        id: '05',
        label: 'Home',
        icon: Home,
        path: '/',
    }
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
    {
        id: '04',
        label: 'EmployeeAdmin',
        icon: IdCardLanyard,
        path: '/employeeAdmin',
    },
    {
        id: '05',
        label: 'ServiceTypes',
        icon: Toolbox,
        path: '/serviceAdmin',
    },
    {
        id: '06',
        label: 'AppointmentAdmin',
        icon: Calendar,
        path: '/appointmentAdmin',
    }
]