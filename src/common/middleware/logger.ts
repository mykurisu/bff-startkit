import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import * as bytes from 'bytes'
import { logger } from '../../core/service/logger.service'
import { HEADER_TRACE_ID } from '../constant/index'

@Injectable()
export class LoggerMiddleware implements NestMiddleware<any, any> {
    async use(@Req() req: Request, @Res() res: Response, next: Function) {
        const startTime: number = Date.now()
        const url: string = req.baseUrl
        const requestID: string = req.header(HEADER_TRACE_ID)
        logger.log(`[${requestID}] --> ${url}`, 'LoggerMiddleware')

        try {
            await next()
        } catch (error) {
            logger.error(`[${requestID}] <-- ${res.statusCode} ${url}`, error, 'LoggerMiddleware')
            throw error
        }

        const onFinish = () => {
            const { url } = req
            const finishTime: number = Date.now()
            const { statusCode } = res
            let length: string
            if (~[204, 205, 304].indexOf(statusCode)) {
                length = ''
            } else {
                const l = Number(res.getHeader('content-length'))
                length = bytes(l) ? bytes(l).toLowerCase() : ''
            }
            logger.log(`[${requestID}] <-- ${res.statusCode} ${url} ${(finishTime - startTime) + 'ms'}`, 'LoggerMiddleware')
        }

        res.once('finish', () => {
            onFinish()
            res.removeListener('finish', onFinish)
        })
    }
}