import { Endpoint } from '@/common/constants/model.names';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { Upload, UploadFilter, UploadQuery } from '@/app/upload/upload.entity';
import { UploadService } from '@/app/upload/upload.service';
import { MaxImageSize } from '@/common/constants/system.consts';
import { PaginatedRes, UserFromToken } from '@/common/types/common.types.dto';
import { RoleType } from '@/common/types/enums';
import { ThrowRes } from '@/common/util/responseFunctions';
import { JwtGuard } from '@/providers/guards/guard.rest';
import { ApiTags } from '@nestjs/swagger';
import { ApiSingleFiltered, FileType, ParseFile, validate } from './fileParser';

@Controller(Endpoint.File)
@ApiTags(Endpoint.File)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @UseGuards(JwtGuard)
  @Post('image')
  @ApiSingleFiltered('file', true, MaxImageSize)
  async createSingle(
    @Req() req: Request,
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<Upload> {
    if (!file || !file.buffer) throw new HttpException('no upload Found', 400);
    if (!validate(FileType.Image, file.mimetype)) {
      throw new HttpException('Invalid File Type', 400);
    }
    const user: UserFromToken = req['user'];

    const img = await this.uploadService.UploadSingle(file, user?._id);
    if (!img.ok) ThrowRes(img);
    return img.body;
  }

  @UseGuards(JwtGuard)
  @Post('')
  @ApiSingleFiltered('file', true, MaxImageSize, FileType.All)
  async createFile(
    @Req() req: Request,
    @UploadedFile(ParseFile) file: Express.Multer.File,
  ): Promise<Upload> {
    if (!file || !file.buffer) throw new HttpException('no upload Found', 400);
    const user: UserFromToken = req['user'];

    const img = await this.uploadService.UploadSingle(file, user?._id);
    if (!img.ok) ThrowRes(img);
    return img.body;
  }

  @Patch(':id')
  @ApiSingleFiltered('file', true, MaxImageSize)
  @UseGuards(JwtGuard)
  async updateById(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!file || !file.buffer) throw new HttpException('no upload Found', 400);
    const user: UserFromToken = req['user'];

    const query = { _id: id };
    if (user.role != RoleType.ADMIN) {
      query['userId'] = user._id;
    }
    const res = await this.uploadService.UpdateSingle(file, query, user._id);
    if (!res.ok) ThrowRes(res);
    return res.body;
  }

  @Patch('image/:id')
  @ApiSingleFiltered('file', true, MaxImageSize)
  @UseGuards(JwtGuard)
  async updateImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!file || !file.buffer) throw new HttpException('no upload Found', 400);
    const user: UserFromToken = req['user'];
    const query = { _id: id };
    if (user.role != RoleType.ADMIN) {
      query['userId'] = user._id;
    }
    const res = await this.uploadService.UpdateSingle(file, query, user._id);
    if (!res.ok) ThrowRes(res);
    return res.body;
  }

  @Delete(':name')
  @UseGuards(JwtGuard)
  async DeleteByName(@Req() req: Request, @Param('name') name: string) {
    //TODO fix this to use the upload name or url to delete the upload

    const user: UserFromToken = req['user'];
    const query = { fileName: name };
    if (user.role != RoleType.ADMIN) {
      query['userId'] = user._id;
    }
    const deleteResp = await this.uploadService.deleteFileByQuery(query);
    if (!deleteResp.ok) if (!deleteResp.ok) ThrowRes(deleteResp);
    return deleteResp.body;
  }

  //================================================     Query Operations ==========

  @Get('')
  async filterAndPaginate(@Query() inputQuery: UploadQuery): Promise<PaginatedRes<Upload>> {
    const res = await this.uploadService.searchManyAndPaginate(
      ['fileName'],
      inputQuery,
      UploadFilter,
    );
    if (!res.ok) throw new HttpException(res.errMessage, res.code);
    return res.body;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.uploadService.findById(id);
    if (!res.ok) throw new HttpException(res.errMessage, res.code);
    return res.body;
  }
}
