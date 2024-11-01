import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwt: JwtService,
    ) { }

    // if returns true, the request will be processed
    // if returns false, the request will be rejected
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("Invalid token");
        }

        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            return false;
        }

        try {
            const user = this.jwt.verify(token);

            request.user = user;

            return true;
        } catch (error) {
            Logger.error(error.message);
            throw new UnauthorizedException("Invalid token");
        }
    }
}