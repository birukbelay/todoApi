// This file provider resizes, calls uploadFile & delte file by name

import { UploadDto } from '@/app/upload/upload.entity';
import { FAIL, Resp, Succeed } from '@/common/constants/return.consts';
import { generateUniqName } from '@/common/util/random-functions';
import { Injectable } from '@nestjs/common';
import { FileUploadProvider } from '../../providers/upload';
interface ImageResizeResponse {
  buffer?: Buffer;
  error?: string;
}
@Injectable()
export class FileProviderService {
  constructor(private fileUploadProvider: FileUploadProvider) {}

  //generate new name & IUploadSingleImage ||
  //dont need it for the new function because the image is generated first
  public async IUploadWithNewName(
    file: Express.Multer.File,
    uid?: string,
    ctr?: number,
  ): Promise<Resp<UploadDto>> {
    const imgName = generateUniqName(file.originalname, uid, ctr);
    const uploaded = await this.fileUploadProvider.UploadOne(imgName.name, file.buffer);
    if (!uploaded.ok) return FAIL(uploaded.errMessage, uploaded.code);
    // uploaded.body.uid = imgName.uid;
    return Succeed(uploaded.body);
  }

  //given a name it resizes the file and uploads it & is the one used with the new function
  public async IUploadSingleImage(file: Buffer, fName: string): Promise<Resp<UploadDto>> {
    // const res = await this.resizeSinglePicW(file);
    // if (!res.ok) return FAIL('resizing failed');
    // return await FUploadToFirebaseFunc(fName, res.val);
    const resp = await this.fileUploadProvider.UploadOne(fName, file);
    return resp;
  }

  //IDeleteImageByPrefix this delete images given a prifix
  public async IDeleteImageByPrefix(id: string): Promise<Resp<any>> {
    if (!id || id.length < 3) return FAIL('file not defined', 400);
    return this.fileUploadProvider.deleteImageByPrefix(id);
  }

  public async IDeleteImageByName(id): Promise<Resp<any>> {
    return this.fileUploadProvider.deleteImageByFileName(id);
  }
}
