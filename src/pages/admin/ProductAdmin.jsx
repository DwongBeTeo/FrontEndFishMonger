import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const ProductAdmin = () => {
    const { user, logout } = useContext(AuthContext);
    
    return (
        <nav style={{ padding: "20px" }}>
            
                <>
                    <span>Hello, {user?.fullName}</span>
                    <div>Product for admin</div>
                    {/* Gọi hàm logout khi click */}
                    <button className="card-btn" onClick={logout}>Đăng xuất</button>
                </>
            
        </nav>
    )
}

export default ProductAdmin;