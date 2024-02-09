import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(value: any) {
    const { error } = this.schema.validate(value);

    if (error) {
      console.log({ error });

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message.replace(/\"/g, "'"),
        error: 'Validation failed',
      });
    }

    return value;
  }
}
