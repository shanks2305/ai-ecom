import crypto from 'crypto';

export default function generateSecureOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    
    // Generate secure random bytes and map them to our digit set
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        otp += digits[randomBytes[i] % 10];
    }
    
    return otp;
}