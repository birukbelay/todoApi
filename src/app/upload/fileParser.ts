import {
  applyDecorators,
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
// import { imageFileRegex } from '@/common/common.types.dto';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { MaxImageSize } from '@/common/constants/system.consts';
import { UnsupportedMediaTypeException } from '@nestjs/common';

export type UploadFields = MulterField & { required?: boolean };

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    metadata: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      // console.log('files===>', files)
      throw new HttpException('Validation failed (upload expected)', 400);
    }
    if (Array.isArray(files) && files.length === 0) {
      throw new HttpException('Validation failed (files expected)', 400);
    }

    return files;
  }
}

/**
 * =================================   For single upload upload decorator
 * @param fieldName
 * @param required
 * @param localOptions
 * @constructor
 */

export function ApiFile(fieldName = 'file', required = false, localOptions?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    //Swagger Documentation
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function ApiSingleFiltered(name, required, size = MaxImageSize, type = FileType.All) {
  return ApiFile(name, required, fileOptions(size, type));
}

export const fileOptions = (size = MaxImageSize, type: FileType): MulterOptions => {
  const options = {
    limits: { fileSize: size },
    fileFilter: createFilter(type),
  };
  return options;
};

export const isImage = (mimeType) => {
  return Boolean(mimeType.match(/(jpg|jpeg|png|gif)/));
};

export const isAudio = (mimeType) => {
  return Boolean(mimeType.match(/(audio\/(mpeg|mp3|wav|ogg|aac|flac))/));
};

export enum FileType {
  Image = 'image',
  Audio = 'audio',
  All = 'all',
}

export const validate = (type: FileType, mimeType): boolean => {
  if (type == FileType.Audio) return isAudio(mimeType);
  if (type === FileType.Image) return isImage(mimeType);
  if (type === FileType.All) return true;
  return false;
};
export const createFilter =
  (allowedTypes: FileType) =>
  (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error, acceptFile: boolean) => void,
  ) => {
    if (!validate(allowedTypes, file.mimetype)) {
      callback(
        new UnsupportedMediaTypeException(`File type is not matching: allowed, Images`),
        false,
      );
    }
    callback(null, true);
  };

/**
 *  =====================================  Multiple Files upload decorators
 * @param uploadFields
 * @param localOptions
 * @constructor
 */
export function ApiFileFields(uploadFields: UploadFields[], localOptions?: MulterOptions) {
  const bodyProperties: Record<string, SchemaObject | ReferenceObject> = Object.assign(
    {},
    ...uploadFields.map((field) => {
      return { [field.name]: { type: 'string', format: 'binary' } };
    }),
  );
  const apiBody = ApiBody({
    schema: {
      type: 'object',
      properties: bodyProperties,
      required: uploadFields.filter((f) => f.required).map((f) => f.name),
    },
  });

  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, localOptions)),
    ApiConsumes('multipart/form-data'),
    // apiBody,
  );
}
