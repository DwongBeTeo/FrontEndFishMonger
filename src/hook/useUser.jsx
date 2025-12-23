// import { useNavigate } from "react-router-dom";

// // useUser dùng để lay thong tin nguoi dung hien tai
// export const useUser = () => {
//     const {user, setUser, clearUser} = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if(user) {
//             return;
//         }

//         let isMounted =  true;
//         const fetchUserInfo = async() => {
//             try {
//                 const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
//                 if(isMounted && response.data) {
//                     setUser(response.data);
//                 }
//             } catch (error) {
//                 console.log("Failed to fetch the user info", error);
//                 if(isMounted) {
//                     clearUser();
//                     navigate('/login');
//                 }
//             }
//         }

//         fetchUserInfo();
//         return () => {
//             isMounted = false;
//         }
//     }, [setUser, clearUser, navigate]);
// }