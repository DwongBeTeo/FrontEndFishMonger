import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import Select from "react-select";

const Input = ({label, value, onChange, placeholder, type, isSelect, options}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // Convert value sang object cho react-select (nếu value match option)
    const selectedOption = isSelect 
        ? options.find(option => option.value === value) || null 
        : null;
    
    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 block mb-1">
                {label}
            </label>
            <div className="relative">
                {isSelect ?(
                    <Select 
                        value={selectedOption}  // Bind object (không phải string)
                        onChange={(selected) => {
                            // Convert sang format onChange native ({target: {value}})
                            onChange({ target: { value: selected ? selected.value : '' } });
                        }}
                        onMenuClose={() => {
                            // Khi người dùng mở dropdown rồi đóng lại (click outside hoặc Esc)
                            // → tự động confirm giá trị hiện tại → tránh bị empty
                            const currentValue = selectedOption ? selectedOption.value : '';
                            onChange({ target: { value: currentValue } });
                        }}
                        options={options}  // Array [{value, label}]
                        placeholder="Search or Select..."  // Optional: Placeholder cho select
                        className="w-full"  // Style cơ bản, bạn có thể custom thêm
                        classNamePrefix="react-select"  // Để custom CSS trong file index.css
                    />
                    // <select
                    //     value={value}
                    //     className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading focus:outline-none focus:border-blue-500"
                    //     onChange={(e) => onChange(e)}
                    // > 
                    // {/* categoryTypeOption (Add Form)*/}
                    //     {options.map((option) => (
                    //         <option key={option.value} value={option.value}>
                    //             {option.label}
                    //         </option>
                    //     ))}

                    // </select>
                ) : (
                    <input
                        className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        type={type === "password" ? (showPassword ? "text" : "password") : type} 
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange({target: {value: e.target.value}})}
                    />
                )}

                {type === 'password' &&(
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye
                                size={20}
                                className= "text-purple-800"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                className= "text-slate-400"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}

export default Input;