import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

type TOptional<T> = T | undefined;

@Injectable()
export class ValidateEnum<T extends Record<string, unknown>>
  implements PipeTransform<T>
{
  constructor(
    public readonly enumObj: T,
    public readonly isRequired = false,
  ) {}

  async transform(
    value: TOptional<T>,
    { data: argName }: ArgumentMetadata,
  ): Promise<TOptional<T>> {
    const withValidation = this.isRequired ? true : value !== undefined;
    if (withValidation) {
      const enumValues = Object.values(this.enumObj);
      if (!enumValues.includes(value)) {
        throw new BadRequestException(
          `Invalid ${argName} '${value}' - accepted values are ${enumValues.join(', ').toLowerCase()}`,
        );
      }
    }

    return value;
  }
}
