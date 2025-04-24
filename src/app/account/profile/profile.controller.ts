import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { ApiSingleFiltered } from '@/app/upload/fileParser';
import { UploadService } from '@/app/upload/upload.service';
import { Endpoint } from '@/common/constants/model.names';
import { MaxImageSize } from '@/common/constants/system.consts';
import { UserFromToken } from '@/common/types/common.types.dto';
import { JwtGuard } from '@/providers/guards/guard.rest';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User, UserService } from '../users';
import { UpdateMeDto } from '../users/entities/user.dto';
import { ChangePasswordInput } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller(Endpoint.Profile)
@ApiTags(Endpoint.Profile)
export class ProfileController {
  constructor(
    private usersService: UserService,
    private profileService: ProfileService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  async getMe(@Req() req: Request) {
    const user: UserFromToken = req['user'];
    const res = await this.usersService.findById(user._id);
    if (!res.ok) throw new HttpException(res.errMessage, res.code);
    return res.body;
  }

  //Au.M-9 Update Me
  @Patch()
  @UseGuards(JwtGuard)
  @ApiSingleFiltered('file', false, MaxImageSize)
  async updateMe(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() input: UpdateMeDto,
  ): Promise<User> {
    const user: UserFromToken = req['user'];
    if (file && file.buffer) {
      const update = await this.uploadService.UploadSingle(file, user._id);
      input.avatarUrl = update.body.url;
    }
    const res = await this.usersService.updateById(user._id, input);
    if (!res.ok) throw new HttpException(res.errMessage, res.code);
    return res.body;
  }

  //AuC-8 change my password
  @Patch('changePassword')
  @UseGuards(JwtGuard)
  async ChangePassword(@Req() req: Request, @Body() input: ChangePasswordInput) {
    const user: UserFromToken = req['user'];

    const ans = await this.profileService.changePassword(user._id, input);
    if (!ans.ok) throw new HttpException(ans.errMessage, ans.code);
    return ans.body;
    // return this.profileService.update(user._id, input);
  }
}
