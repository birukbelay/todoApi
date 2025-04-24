import { UploadDto } from '@/app/upload/upload.entity';
import { Resp } from '../../common/constants/return.consts';
export { CloudinaryService as FileUploadProvider } from './cloudinary';
export interface FileServiceInterface {
  // firebaseVerifyToken(token: string): Promise<Resp<any>>;

  deleteImageByPrefix(id: string): Promise<Resp<boolean>>;
  deleteImageByFileName(id: string): Promise<Resp<boolean>>;

  UploadOne(fName: string, file: Buffer): Promise<Resp<UploadDto>>;
}
