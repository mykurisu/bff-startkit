import { createParamDecorator } from '@nestjs/common';
import { HEADER_TRACE_ID } from '../constant/index'

export const TraceID = createParamDecorator((data, req) => {
  return req.headers[HEADER_TRACE_ID];
});
