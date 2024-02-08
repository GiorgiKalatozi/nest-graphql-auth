import { AuthGuard } from '@nestjs/passport';
import { JwtStrategyName } from '../enums';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export class RefreshTokenGuard extends AuthGuard(JwtStrategyName.JWT_REFRESH) {
  constructor() {
    super();
  }

  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
