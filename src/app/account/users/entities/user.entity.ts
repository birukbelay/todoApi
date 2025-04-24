import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { RoleType } from '@/common/types/enums';
import { Expose, Transform } from 'class-transformer';
import { ACCOUNT_STATUS } from '../../profile/dto/profile.dto';
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      // delete ret._id;
    },
  },
})
export class User {
  // @Prop({
  //   get: (id: string) => {
  //     return id
  //   },
  // })
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  readonly _id: string;

  @Prop({ type: String, unique: true, sparse: true })
  email: string;

  @Prop({ type: String, unique: true, sparse: true })
  phone: string;

  @Prop({ type: String, unique: true, sparse: true })
  userName: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  fullName?: string;

  @Prop({ type: String, select: false })
  @ApiHideProperty()
  password: string;

  @Prop({
    type: String,
    enum: Object.values(RoleType),
    default: RoleType.USER,
  })
  role: RoleType = RoleType.USER;

  @ApiHideProperty()
  @Prop({ type: String, select: false })
  hashedRefreshToken: string;

  @Prop({ type: String, select: false, required: false })
  @ApiHideProperty()
  verificationCodeHash: string;

  @Prop({ select: false, required: false })
  @ApiHideProperty()
  verificationCodeExpires: number;

  @Prop({ type: Boolean, required: false })
  active: boolean;

  /**
   * These are properties for account setup
   */

  @Prop({ required: false })
  idImage?: string;

  @Prop({
    type: String,
    enum: Object.values(ACCOUNT_STATUS),
  })
  accountStatus: ACCOUNT_STATUS;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
// Create indexes
UserSchema.index({ phone: 'text', email: 'text' });

// Hook before insert or save

UserSchema.pre('save', setDefaultFullName);

UserSchema.virtual('id').get(function () {
  return this._id;
});

// UserSchema.virtual('fullName').get(function () {
//   return this.firstName + ' ' + this.lastName;
// });

async function setDefaultFullName(this: User, next) {
  try {
    if (this.firstName && !this.fullName) {
      this.fullName = this.firstName + ' ' + this.lastName;
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
