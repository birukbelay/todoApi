import { OmitType, PartialType } from '@nestjs/swagger';

import { RoleType } from '@/common/types/enums';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserInput {
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class UpdateMeDto extends PartialType(OmitType(RegisterUserInput, ['email', 'password'])) {}

/**
 * for admins updating and creating a user
 */
export class CreateUserDto extends RegisterUserInput {
  @IsNotEmpty()
  role: RoleType;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class UpdateUserWithRole extends PartialType(
  OmitType(CreateUserDto, ['email', 'password']),
) {}

export class FilterUser extends PartialType(OmitType(CreateUserDto, ['avatarUrl', 'password'])) {}

export class UpdateEmailInput {
  @IsEmail()
  newEmail: string;
}
export const UserFilter: (keyof CreateUserDto)[] = [
  'email',
  'firstName',
  'active',
  'lastName',
  'role',
];
