import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    InternalServerErrorException
} from '@nestjs/common'
import { logger } from '../../core/service/logger.service'

@Catch()
export default class ErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const url = request.originalUrl
        const message = exception.message || '请求异常'

        if (exception instanceof HttpException || exception instanceof InternalServerErrorException) {
            const errObj: any = exception.getResponse()
            const code = exception.getStatus()
            response.status(code === 401 ? 401 : 201);
            response.header('Content-Type', 'application/json; charset=utf-8');
            const obj: any = {
                msg: message,
                message: code === 401 ? '暂无权限访问' : message,
                code,
                url,
            }
            if (errObj.serviceErrCode) obj.code = errObj.serviceErrCode
            response.send(obj);
        } else {
            response.status(201);
            response.header('Content-Type', 'application/json; charset=utf-8');
            response.send({
                msg: message,
                message: '请求异常',
                code: -10000,
                url,
            });
        }

        if (exception && typeof (exception) === 'object') {
            logger.error(`${request.header('X-TRACE-ID')} - ${exception.message}`, exception.stack, 'ErrorResp', {
                headers: request.headers || {},
                body: request.body || {},
                requestID: request.header('X-TRACE-ID') || '',
            })
        } else {
            logger.error(String(exception), '')
        }
    }
}