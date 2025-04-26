import { randomBytes } from 'crypto';

export class TokenGenerator {
    /**
     * Generates a cryptographically secure random token in hex format.
     * Default length: 32 hex characters (16 bytes).
     */
    static generateToken(): string {
        return randomBytes(16).toString('hex'); // 16 bytes = 32 hex characters
    }

    /**
     * Generates a numeric OTP with a default length of 6.
     * @param otpLength The length of the OTP (default is 6).
     */
    static generateOTP(otpLength: number = 6): string {
        const min = Math.pow(10, otpLength - 1);
        const max = Math.pow(10, otpLength) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
}
