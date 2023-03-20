import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CoreModule } from './core/core.module'

/* 业务模块 */
import { OrderModule } from './business/order/order.module'
/* 业务模块 */

import Config from './common/config/index'


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
      isGlobal: true,
    }),
    CoreModule,
    OrderModule,
  ],
})
export default class AppModule {
  constructor() { }
}
