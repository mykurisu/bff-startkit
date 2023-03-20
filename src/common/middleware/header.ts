import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common'
import { Response, Request } from 'express'
import { HEADER_TRACE_ID } from '../constant/index'


interface IRequest extends Request {
    traceID: string
}

@Injectable()
export class HeaderMiddleware implements NestMiddleware<any, any> {
    async use(@Req() req: IRequest, @Res() res: Response, next: Function) {
        const traceID = req.header(HEADER_TRACE_ID)
        if (traceID) req.traceID = traceID
        next()
    }
}