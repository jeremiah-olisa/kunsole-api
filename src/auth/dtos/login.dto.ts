import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exists } from "src/common/decorators/database/exists.decorator";
import { User } from "@prisma/client";

export class LoginDto {
    @ApiProperty({
        example: "user@example.com",
        description: "The email of the user",
    })
    @IsEmail()
    @IsNotEmpty()
    @Exists<User>({ table: "user", column: "email", message: "Invalid login credentials" })
    email: string;

    @ApiProperty({
        example: "P@ssw0rd!",
        description: "The password of the user",
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}


