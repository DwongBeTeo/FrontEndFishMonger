import logo from './images/logo.png';
import login_bg from './images/login-bg.jpg';
import slider1 from './images/slider1.jpg';
import slider2 from './images/slider2.jpg';
import slider3 from './images/slider3.jpg';
import { BluetoothSearching, Calendar, Fish, Home, IdCardLanyard, List, ListOrdered, Newspaper, Notebook, NotebookTabs, ShoppingCart, Ticket, Toolbox, User } from 'lucide-react';

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
        label: 'Bảng Điều Khiển',
        icon: Home,
        path: '/dashboard',
    },
    {
        id: '02',
        label: 'Sản Phẩm',
        icon: Fish,
        path: '/productAdmin',
    },
    {
        id: '03',
        label: 'Loại Sản Phẩm',
        icon: List,
        path: '/categoryAdmin',
    },
    {
        id: '04',
        label: 'Đơn Đặt Hàng',
        icon: ListOrdered,
        path: '/orderAdmin',
    },
    {
        id: '05',
        label: 'Nhân Viên',
        icon: IdCardLanyard,
        path: '/employeeAdmin',
    },
    {
        id: '06',
        label: 'Dịch Vụ',
        icon: Toolbox,
        path: '/serviceAdmin',
    },
    {
        id: '07',
        label: 'Lịch Hẹn',
        icon: Calendar,
        path: '/appointmentAdmin',
    },
    {
        id: '08',
        label: 'Voucher',
        icon: Ticket,
        path: '/voucherAdmin',
    },
    {
        id: '09',
        label: 'Danh Mục Bài Viết',
        icon: NotebookTabs,
        path: '/blogCategoryAdmin',
    },
    {
        id: '10',
        label: 'Bài Viết',
        icon: Newspaper,
        path: '/postAdmin',
    },
    {
        id: '11',
        label: 'Thông tin Cá Nhân',
        icon: User,
        path: '/my-profile',
    }
]