import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ApiKeyGuard } from "./api-key.guard";
import { Observable } from "rxjs";

@Injectable()
export class JwtOrApiKeyGuard implements CanActivate {
    constructor(
        private jwtGuard: JwtAuthGuard,
        private apiKeyGuard: ApiKeyGuard
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const jwtResult = this.jwtGuard.canActivate(context);
            if (jwtResult instanceof Promise) {
                return jwtResult.catch(() => this.apiKeyGuard.canActivate(context));
            }
            return jwtResult;
        } catch (e) {
            return this.apiKeyGuard.canActivate(context);
        }
    }
}