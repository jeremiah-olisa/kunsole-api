import { registerDecorator, ValidationOptions } from 'class-validator';
import { TableColumns, TableNames } from 'src/common/types';


export function Unique<Table>(
    validationOptions?: ValidationOptions & {
        table: TableNames;
        column: TableColumns<Table>;
    },
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                async validate(value: any) {
                    // const prisma = new PrismaClient();
                    const query = {
                        [validationOptions?.column as string]: value,
                    };

                    this.value = value;
                    const result =
                        (await global.prisma[validationOptions?.table as string]?.count({
                            where: query,
                        })) < 1;
                    // await prisma.$disconnect();

                    // console.log("Unique validation prisma closed!", { result })
                    return result;
                },
                defaultMessage(): string {
                    return `'${this.value}' is not a unique value`;
                },
            },
        });
    };
}

