import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Todo, TodoDocument } from './todo.entity';

import { MongoGenericRepository } from '@/providers/database/base/mongo.base.repo';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class TodoService extends MongoGenericRepository<Todo> {
  constructor(
    @InjectModel(Todo.name) private tagModel: Model<TodoDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    super(tagModel);
  }
}
