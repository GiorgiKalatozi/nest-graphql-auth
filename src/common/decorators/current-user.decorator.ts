import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IJwtPayloadRefreshToken } from 'src/modules/auth/interfaces';

export const CurrentUser = createParamDecorator(
  (
    data: keyof IJwtPayloadRefreshToken | undefined,
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (data) {
      return req.user?.[data];
    }

    return req.user;
  },
);
