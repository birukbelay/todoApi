import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Upload, UploadDocument } from './upload.entity';

import { FileProviderService } from '@/app/upload/file-provider.service';
import { FAIL, Resp, Succeed } from '@/common/constants/return.consts';
import { generateUniqName } from '@/common/util/random-functions';
import { MongoGenericRepository } from '@/providers/database/base/mongo.base.repo';
import { Model } from 'mongoose';

@Injectable()
export class UploadService extends MongoGenericRepository<Upload> {
  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    private fileService: FileProviderService,
  ) {
    super(uploadModel);
  }

  //upload single takes (file, the uid, userId) then upload the file then save it to database
  public async UploadSingle(
    file: Express.Multer.File,
    userId: string,
    uid = '', //the uid for multi image upload function
    ctr = 0, //the counter for multi image upload function
  ): Promise<Resp<Upload>> {
    if (!file) return FAIL('File Must not be empty', 400);
    const imgName = generateUniqName(file.originalname, uid, ctr);
    const uploaded = await this.fileService.IUploadSingleImage(file.buffer, imgName.name);
    if (!uploaded.ok) return FAIL(uploaded.errMessage, uploaded.code);

    const upload = await this.createOne({ ...uploaded.body, userId });
    if (!upload.ok) return FAIL(upload.errMessage, upload.code);

    // logTrace('val', data);
    // logTrace('val', uploaded.val);
    return Succeed(upload.body);
  }

  public async UpdateSingle(
    file: Express.Multer.File,
    query,
    userId: string,
  ): Promise<Resp<Upload>> {
    if (!file) return FAIL('Image Must not be empty', 400);
    //Find the image from the database
    const oldFile = await this.findOne(query);
    if (!oldFile.ok) return FAIL(oldFile.errMessage, oldFile.code);
    // Delete The old Image File
    if (!oldFile.body.fileName || oldFile.body.fileName.length < 3)
      return FAIL('fileName Not found', 400);
    const resp = await this.fileService.IDeleteImageByPrefix(oldFile.body.fileName);
    if (!resp.ok) return FAIL(resp.errMessage, resp.code);
    // Create a new image, we dont care about the name
    const uploaded = await this.fileService.IUploadWithNewName(file);
    if (!uploaded.ok) return FAIL(uploaded.errMessage, uploaded.code);
    //update the images details on the database
    //TODO: update the upload hash and size
    const res = await this.updateById(oldFile.body._id, {
      ...uploaded.body,
      userId,
    });
    if (!res.ok) return FAIL(res.errMessage, res.code);
    // upload.val.fullImg = uploaded.val.fullImg;
    return Succeed(res.body);
  }

  //uses IDeleteImageByPrefix
  //Finds a file via a query and delete the imgData and all related sub images
  public async deleteFileByQuery(query) {
    const file = await this.findOne(query);
    if (!file.ok) return FAIL(file.errMessage, file.code);

    const resp = await this.fileService.IDeleteImageByPrefix(file.body.fileName);
    if (!resp.ok) return FAIL(resp.errMessage, resp.code);

    const upload = await this.findByIdAndDelete(file.body._id);
    if (!upload.ok) return FAIL(upload.errMessage, upload.code);
    return upload;
  }
}
