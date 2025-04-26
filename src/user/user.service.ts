import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { OAuthUserPayload } from 'src/auth/interfaces/auth.interface';
import { AuthProvider } from '@prisma/client';
import { ICreateUserPayload } from './interfaces/user.interface';

@Injectable()
export class UserService {
    async getSecretKeyForValidationByPublicKeyOrThrow(publicKey: string) {
        const result = await this.getSecretKeyForValidationByPublicKey(publicKey)

        if (!result) throw new NotFoundException('Public key not found');

        return result;
    }

    updateRefreshToken(userKey: string, refreshToken: string) {
        return this.userRepository.updateRefreshToken(userKey, refreshToken);
    }

    getSecretKeyForValidationByPublicKey(publicKey: string) {
        return this.userRepository.getSecretKeyForValidationByPublicKey(publicKey);
    }

    findUserByEmail(email: string) {
        return this.userRepository.findUserByEmail(email);
    }

    createUser(payload: ICreateUserPayload) {
        return this.userRepository.createUser(payload);
    }

    findUserByUserKey(sub: any) {
        return this.userRepository.findUserByUserKey(sub);
    }

    findOrCreateOAuthUser(payload: OAuthUserPayload, provider: AuthProvider) {
        return this.userRepository.findOrCreateOAuthUser(payload, provider);
    }

    async getUserNameById(userId: string) {
        const data = await this.userRepository.getUserNameById(userId);
        if (!data) {
            throw new NotFoundException('User not found');
        }
        return data.fullName;
    }

    async getUserIdByEmail(email: string) {
        const data = await this.userRepository.getUserIdByEmail(email);
        if (!data) {
            throw new NotFoundException(`User '${email}' not found`);
        }
        return data;
    }

    constructor(private readonly userRepository: UserRepository) { }
}
