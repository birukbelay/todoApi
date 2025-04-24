import { PaginationInputs } from '@/common/types/common.types.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';
export enum UploadModel {
  Category = 'Category',
  Genre = 'Genre',
  Book = 'Book',
  Author = 'Author',
  Donation = 'Donation',
  NotAssigned = 'NotAssigned',
}

export enum UploadStatus {
  Draft = 'draft',
  Uploaded = 'uploaded',
  Active = 'active',
}

@Schema({ timestamps: true })
export class Upload {
  _id: string;

  @Prop({ type: String })
  userId?: string;

  /**
   * FILE_NAME: this the actual images name, which is put on firebase, it could be empyt when draft
   */
  @Prop({ type: String, unique: true, sparse: true })
  @IsString()
  fileName: string;

  /**
   * URL < Full path of the image, it is what is returned to the user includes all the prefix and suffix
   */
  @Prop({ type: String, unique: true, sparse: true })
  url: string;

  @IsOptional()
  @IsString()
  @Prop({
    type: String,
    enum: Object.values(UploadStatus),
    default: UploadStatus.Draft,
  })
  status?: UploadStatus;
}

export class UpdateDto extends PartialType(OmitType(Upload, ['_id'])) {}

export type UploadDocument = Upload & Document;
export const UploadSchema = SchemaFactory.createForClass(Upload);

// Upload Dto is saved inside the img object of the models
@Schema({ _id: false })
export class UploadDto extends PickType(Upload, ['fileName', 'url', 'status']) {
  @Prop({ type: String })
  _id?: string;
}

export class UpdateBody {
  @IsOptional()
  removedImages?: string[];
}

export class UploadQuery extends PaginationInputs {
  @IsOptional()
  fileName?: string;

  @IsOptional()
  uid?: string;

  @IsOptional()
  isPrimary?: boolean;

  @IsOptional()
  userId?: string;
}

export const UploadFilter: (keyof Upload)[] = ['fileName', 'url', 'userId', 'status', '_id'];
