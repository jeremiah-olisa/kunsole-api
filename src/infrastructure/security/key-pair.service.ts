import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class KeyPairService {
    private readonly SALT_ROUNDS = 12;

    async generateKeyPair(): Promise<{
        publicKey: string;
        secretKey: string;
        hashedSecretKey: string;
    }> {
        // Generate key pair
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });

        // Create a random secret key
        const secretKey = crypto.randomBytes(32).toString('hex');
        const hashedSecretKey = await bcrypt.hash(secretKey, this.SALT_ROUNDS);

        return {
            publicKey: this.serializeKey(publicKey),
            secretKey: `${privateKey}::${secretKey}`, // Only shown once!
            hashedSecretKey,
        };
    }

    async validateSecretKey(
        providedSecret: string,
        hashedSecretKey: string,
    ): Promise<boolean> {
        return bcrypt.compare(providedSecret, hashedSecretKey);
    }

    private serializeKey(key: string): string {
        return key
            .replace(/-----BEGIN.*?-----/g, '')
            .replace(/-----END.*?-----/g, '')
            .replace(/\n/g, '');
    }

    private deserializeKey(serialized: string, type: 'public' | 'private'): string {
        const prefix = type === 'public'
            ? '-----BEGIN PUBLIC KEY-----\n'
            : '-----BEGIN PRIVATE KEY-----\n';
        const suffix = type === 'public'
            ? '\n-----END PUBLIC KEY-----'
            : '\n-----END PRIVATE KEY-----';
        return `${prefix}${serialized.match(/.{1,64}/g)?.join('\n')}${suffix}`;
    }
}