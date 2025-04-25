import { registerDecorator, ValidationOptions } from 'class-validator';
import { DataType, TableColumns, TableNames } from 'src/common/types';
import { parseData } from 'src/common/utils/data';

export function Exists<Table>({
  table,
  column,
  dataType = 'string',
  isDtoValueOptional = false,
  ...defaultValuOptions
}: ValidationOptions & {
  table: TableNames;
  column: TableColumns<Table>;
  dataType?: DataType;
  isDtoValueOptional?: boolean;
}) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: defaultValuOptions,
      validator: {
        async validate(value: any) {
          isDtoValueOptional ??= false;

          console.log({ value });

          if (isDtoValueOptional && !value) return true;

          // const where = {
          //   [column as string]: isBigInt ? BigInt(value) : value,
          // };

          const where = {
            [column as string]: parseData(value, dataType),
          };

          this.value = value;

          const queryResult = await global.prisma[table as string]?.count({
            where,
          });

          // await prisma.$disconnect();

          console.log('Exists validation prisma closed!', { queryResult });

          return queryResult > 0;
        },
        defaultMessage(): string {
          return `${propertyName} '${this.value}' does not exist or is invalid`;
        },
      },
    });
  };
}
