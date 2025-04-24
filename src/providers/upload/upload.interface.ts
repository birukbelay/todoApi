import { UploadDto } from '@/app/upload/upload.entity';
import { Resp } from '../../common/constants/return.consts';

export interface FileServiceInterface {
  deleteImageByPrefix(id: string): Promise<Resp<boolean>>;
  deleteImageByFileName(id: string): Promise<Resp<boolean>>;

  UploadOne(fName: string, file: Buffer): Promise<Resp<UploadDto>>;
}
