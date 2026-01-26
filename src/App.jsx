import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/user/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryAdmin from "./pages/admin/CategoryAdmin";
import OrderAdmin from "./pages/admin/OrderAdmin";
import ProductAdmin from "./pages/admin/ProductAdmin";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import CategoryPage from "./pages/user/CategoryPage";
import AquariumPage from "./pages/user/AquariumPage";
import SearchPage from "./pages/user/SearchPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import CartPage from "./pages/user/CartPage";
import MyOrdersPage from "./pages/user/order/MyOrdersPage";
import OrderDetailPage from "./pages/user/order/OrderDetailPage";
import EmployeePage from "./pages/admin/EmployeeAdmin";
import ServiceAdmin from "./pages/admin/ServiceAdmin";
import AppointmentAdmin from "./pages/admin/AppointmentAdmin";
import AccessoryPage from "./pages/user/AccessoryPage";
import ProductDetail from "./pages/user/ProductDetail";
import ServiceListPage from "./pages/user/service/ServiceListPage";
import ServiceDetailPage from "./pages/user/service/ServiceDetailPage";
import BookingPage from "./pages/user/service/BookingPage";
import MyAppointmentsPage from "./pages/user/service/MyAppointmentsPage";

const App = () => {
  return (
    <>
      
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          {/* Warp all in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/category/:slug/:categoryId" element={<CategoryPage />} />
            <Route path="/aquarium" element={<AquariumPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/accessory" element={<AccessoryPage />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/services" element={<ServiceListPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            {/* Pages Admin */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/categoryAdmin" element={<CategoryAdmin />} />
                <Route path="/orderAdmin" element={<OrderAdmin />} />
                <Route path="/productAdmin" element={<ProductAdmin />} />
                <Route path="/employeeAdmin" element={<EmployeePage />} />
                <Route path="/serviceAdmin" element={<ServiceAdmin />} />
                <Route path="/appointmentAdmin" element={<AppointmentAdmin />} />
            </Route>
            

            {/* Pages User */}
            <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              {/* <Route path="/order-success" element={<OrderSuccessPage />} /> */}
              <Route path="/my-orders" element={<MyOrdersPage />} />
              
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            </Route>
            {/* Pages for both USER and ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
              <Route path="/order/:orderId" element={<OrderDetailPage />} />
            </Route>
          </Route>

        </Routes>
    </>
  )
}

export default App;