import { UserEntity } from '../../auth/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user: UserEntity;
        }
    }
}