import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios';

import { CacheService } from './service/cache.service'
import { InfraService } from './service/infra.service'
import { MyLoggerService } from './service/logger.service'
import { CosService } from './service/cos.service'

import { CoreController } from './core.controller'

import { HeaderMiddleware } from '../common/middleware/header'
import { LoggerMiddleware } from '../common/middleware/logger'

@Global()
@Module({
    imports: [HttpModule],
    controllers: [CoreController],
    providers: [CacheService, InfraService, MyLoggerService, CosService],
    exports: [HttpModule, CacheService, InfraService, MyLoggerService]
})
export class CoreModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HeaderMiddleware, LoggerMiddleware).forRoutes('*')
    }
}