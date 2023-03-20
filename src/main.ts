import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import * as dotenv from 'dotenv'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'

import AppModule from './app.module'
import StandardRespInterceptor from './common/interceptor/standardResp'
import ErrorFilter from './common/filter/errorResp'
import { logger } from './core/service/logger.service'

const { ENV = 'dev' } = process.env
const envFileName = `.env.${ENV}`

dotenv.config({
  path: join(__dirname, `../${envFileName}`)
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('bff')

  app.use(cookieParser())

  app.enableCors()

  app.useGlobalFilters(new ErrorFilter())

  app.useGlobalInterceptors(new StandardRespInterceptor())

  app.use(compression())

  const PORT = process.env.NODE_ENV === 'development' ? process.env.DEV_PORT : process.env.PORT

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  await app.listen(PORT, () => {
    logger.log(`Listening Port ${PORT}`, 'Main')
    logger.log('===========环境变量BEGIN===========', 'Main')
    logger.log(`APP_ENV     ${process.env.APP_ENV}`, 'Main')
    logger.log(`ENV         ${process.env.ENV}`, 'Main')
    logger.log(`SERVER_API  ${process.env.SERVER_API}`, 'Main')
    logger.log(`SERVER_HOST ${process.env.SERVER_HOST}`, 'Main')
    logger.log('===========环境变量END===========', 'Main')
  })
}

bootstrap();
