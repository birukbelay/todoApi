import { Module } from '@nestjs/common';
import { AuthModule } from './app/account/auth/auth.module';
import { ProfileModule } from './app/account/profile/profile.module';
import { UsersModule } from './app/account/users/users.module';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { DatabaseModule } from './providers/database/databaseModule';

import { UploadModule } from '@/app/upload/upload.module';

import { TodoModule } from './app/todo/todo.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    TodoModule,
    UploadModule,

    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000,
    //     limit: 10,
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
