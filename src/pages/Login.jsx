import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import { LoaderCircle } from "lucide-react";
import { assets } from "../assets/asset";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { validateEmail } from "../util/Validation";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const {setUser, login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        //basic validation
        if(!password) {
            setError("Please fill password in field");
            setIsLoading(false);
            return;
        }else if(!validateEmail(email)){
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }
        setError("");

        //Login API call can be placed here
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password
            });
            const {token, user} = response.data;
            console.log(token,user);
            
            if (token) {
                // GỌI HÀM LOGIN CỦA CONTEXT
                // Login.jsx không cần quan tâm logic xử lý data nữa
                const role = login(token, user);

                // Chỉ lo việc điều hướng
                if (role === "ADMIN") navigate('/productAdmin');
                else navigate('/product');
            }
        } catch (error) {
            if (error.response && error.response.message) {
                setError(error.response.message);
            }else {
                console.error(error);
                setError("Invalid email or password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background image with blur*/}
            <img src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />

            <div className="relative z-10 w-full max-w-lg px-6">

                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Login Your Account
                    </h3>
                    {/* <p className="text-base text-slate-700 text-center m-8"> */}
                    <p className="text-base md:text-lg text-slate-600 text-center mt-6 mb-8 max-w-md mx-auto leading-relaxed">
                        Welcome back! Please enter your details.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            type="email"
                            placeholder="example@gmail.com"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                        />

                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}

                        <button disabled={isLoading} className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 text-lg rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 
                            flex items-center justify-center gap-2 ${
                            isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl transform hover:-translate-y-0.5'
                        }`} type="submit">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5"/>
                                    Logging in...
                                </>
                            ): (
                                "LOGIN"
                            )}
                        </button>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-800 text-center mt-6">
                                Don't have an account?{' '}
                                <Link to="/sign-up" className="font-medium text-primary hover:underline hover:text-primary-dark transition-colors">
                                    Sign Up
                                </Link>
                            </p>

                            <a className="text-sm text-slate-800 text-center mt-6">
                                Forgot Password?(Chưa hoàn thành)
                            </a>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;