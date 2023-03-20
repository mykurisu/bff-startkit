import { join } from 'path'

const ROOT_PATH = join(__dirname, '../../')

const CODES = {
    SUCCESS: '0',
    FETCH_OPTIONS_ERROR: '-1000',
    RESP_ERROR: '-2000',
}

const ERROR_MESSAGE_MAP = {
    [CODES.FETCH_OPTIONS_ERROR]: 'Fetch Options Deficiency',
    [CODES.RESP_ERROR]: 'Response Data Undefined'
}

const HEADER_TRACE_ID = 'X-TRACE-ID'

export {
    CODES,
    ERROR_MESSAGE_MAP,
    ROOT_PATH,
    HEADER_TRACE_ID,
}