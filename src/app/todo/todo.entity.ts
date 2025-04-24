import { PaginationInputs } from '@/common/types/common.types.dto';
import { TodoStatus } from '@/common/types/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';
@Schema({ timestamps: true, versionKey: false })
export class Todo {
  @ApiProperty({ name: 'id' })
  @Expose({ name: 'id' })
  readonly _id: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ type: String })
  title: string;

  @IsOptional()
  @IsString()
  @Prop({ type: String })
  body?: string;

  @IsOptional()
  @Prop({ type: [{ type: String }] })
  tags: string[];

  @Prop({ type: String, unique: true, sparse: true })
  slug: string;

  @IsString()
  @IsOptional()
  @Prop({
    type: String,
    enum: Object.values(TodoStatus),
    default: TodoStatus.Todo,
  })
  status: TodoStatus;

  @IsOptional()
  @Prop({ type: String })
  imgUrl?: string;

  @IsOptional()
  @Prop({ type: String })
  imgId?: string;

  @IsOptional()
  @Prop({ type: String })
  fileUrl?: string;

  @IsOptional()
  @Prop({ type: String })
  fileId?: string;

  @Prop({ type: String })
  userId?: string;

  @Prop({ type: Boolean, required: false })
  completed: boolean;
}

export type TodoDocument = Todo & Document;
export const TodoSchema = SchemaFactory.createForClass(Todo);
// Create indexes
TodoSchema.index({ title: 'text' });

export class CreateTodoInput extends OmitType(Todo, ['_id', 'slug', 'userId']) {
  @IsOptional()
  @ApiHideProperty()
  slug?: string;

  @IsOptional()
  @ApiHideProperty()
  userId?: string;
}

export class UpdateDto extends PartialType(OmitType(CreateTodoInput, ['slug'])) {}

export class TodoQuery extends PaginationInputs {
  @IsOptional()
  tags?: string[];

  @IsOptional()
  completed: boolean;

  @IsOptional()
  @ApiHideProperty()
  userId?: string;
}

export const TodoFilter: (keyof Todo)[] = ['title', 'status', 'fileUrl', '_id', 'userId'];
