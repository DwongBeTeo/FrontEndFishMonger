import { BrowserRouter, Route, Routes } from "react-router-dom";
import Product from "./pages/user/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryAdmin from "./pages/admin/CategoryAdmin";
import OrderAdmin from "./pages/admin/OrderAdmin";
import ProductAdmin from "./pages/admin/ProductAdmin";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          
          {/* Pages Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/categoryAdmin" element={<CategoryAdmin />} />
              <Route path="/orderAdmin" element={<OrderAdmin />} />
              <Route path="/productAdmin" element={<ProductAdmin />} />
          </Route>

          {/* Pages User */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
              <Route path="/product" element={<Product />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;