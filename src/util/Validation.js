export const validateEmail = (email) => {
    if(email.trim()){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    return false;
}

/**
 * Validate a phone number.
 * @param {string} phone The phone number to validate.
 * @returns {boolean} True if the phone number is valid, false otherwise.
 * A valid phone number is a string of exactly 10 digits.
 */
export const isValidPhone = (phone) => {
    if(phone.trim()){
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
    return false;
}
