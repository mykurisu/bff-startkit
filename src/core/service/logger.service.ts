import { LoggerService, Logger } from '@nestjs/common'

class MyLoggerService implements LoggerService {
    log(message: string, context?: string) {
        Logger.log(message, context)
    }
    error(message: any, stack?: string, context?: string, extra?: any) {
        Logger.error(message, stack || '', context || '')
    }
    warn(message: string, context?: string) {
        Logger.warn(message, context)
    }
}

const logger = new MyLoggerService()

export {
    MyLoggerService,
    logger
}
