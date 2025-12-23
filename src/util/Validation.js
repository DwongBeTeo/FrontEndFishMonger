export const validateEmail = (email) => {
    if(email.trim()){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    return false;
}

export const validatePhone = (phone) => {
    if(phone.trim()){
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
    return false;
}
