import { UploadService } from '@/app/upload/upload.service';
import { Endpoint } from '@/common/constants/model.names';
import { ReqParamPipe } from '@/common/lib/pipes';
import { PaginatedRes, UserFromToken } from '@/common/types/common.types.dto';
import { generateSlug } from '@/common/util/random-functions';
import { ThrowRes } from '@/common/util/responseFunctions';
import { JwtGuard } from '@/providers/guards/guard.rest';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTodoInput, Todo, TodoFilter, TodoQuery, UpdateDto } from './todo.entity';
import { TodoService } from './todo.service';

@Controller(Endpoint.Todo)
@ApiTags(Endpoint.Todo)
export class TodoController {
  constructor(private readonly service: TodoService, private uploadService: UploadService) {}

  @Post()
  @UseGuards(JwtGuard)
  async createOne(@Req() req: Request, @Body() createDto: CreateTodoInput): Promise<Todo> {
    const user: UserFromToken = req['user'];
    createDto.userId = user._id;
    if (createDto?.imgId) {
      const img = await this.uploadService.findOne({ _id: createDto.imgId });
      if (!img.ok) ThrowRes(img);
      createDto.imgUrl = img.body.url;
    }
    if (createDto?.fileId) {
      const file = await this.uploadService.findOne({ _id: createDto.fileId });
      if (!file.ok) ThrowRes(file);
      createDto.fileUrl = file.body.url;
    }
    createDto.slug = generateSlug(createDto.title, true);
    const resp = await this.service.createOne(createDto);
    if (!resp.ok) ThrowRes(resp);
    return resp.body;
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async update(@Req() req: Request, @Param('id') id: string, @Body() updateDto: UpdateDto) {
    const user: UserFromToken = req['user'];

    if (updateDto?.imgId) {
      const img = await this.uploadService.findOne({ _id: updateDto.imgId });
      if (!img.ok) ThrowRes(img);
      updateDto.imgUrl = img.body.url;
    }
    if (updateDto?.fileId) {
      const file = await this.uploadService.findOne({ _id: updateDto.fileId });
      if (!file.ok) ThrowRes(file);
      updateDto.fileUrl = file.body.url;
    }
    const res = await this.service.findOneAndUpdate({ _id: id, userId: user._id }, updateDto);
    if (!res.ok) ThrowRes(res);
    return res.body;
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async remove(@Req() req: Request, @Param('id', ReqParamPipe) id: string) {
    const user: UserFromToken = req['user'];

    const deleteResp = await this.service.findOneAndRemove({ _id: id, userId: user._id });
    if (!deleteResp.ok) ThrowRes(deleteResp);
    //delete the file
    // const result = await this.uploadService.deleteFileByQuery({ url: deleteResp.body.url });
    // if (!result.ok) ThrowRes(result);
    return deleteResp.body;
  }

  @Get()
  @UseGuards(JwtGuard)
  async filterAndPaginate(
    @Req() req: Request,
    @Query() inputQuery: TodoQuery,
  ): Promise<PaginatedRes<Todo>> {
    const user: UserFromToken = req['user'];
    inputQuery.userId = user._id;
    let tags = inputQuery.tags;
    const additionalQuery = {};
    if (tags && !Array.isArray(tags)) {
      // If `tags` is not an array, convert it to a single-element array.
      tags = [tags];
    }

    if (inputQuery?.tags && inputQuery.tags.length > 0) {
      additionalQuery['tags'] = { $in: tags };
    }
    const res = await this.service.searchManyAndPaginate(
      ['title', 'body'],
      inputQuery,
      TodoFilter,
      additionalQuery,
    );
    if (!res.ok) throw new HttpException(res.errMessage, res.code);
    return res.body;
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    const res = await this.service.findById(id);
    if (!res.ok) throw new HttpException(res.errMessage, res.code);
    return res.body;
  }
}
