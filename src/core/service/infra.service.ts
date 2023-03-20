import { join } from 'path'
import { lastValueFrom } from 'rxjs'
import { AxiosRequestConfig } from 'axios'
import { HttpService } from '@nestjs/axios'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CODES, ERROR_MESSAGE_MAP } from '../../common/constant'
import { CacheService } from './cache.service'


@Injectable()
export class InfraService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
    ) { }

    /**
     * 获取本地配置文件
     * @param {string} moduleName 模块名
     * @param {string} configKey 配置标识
     */
    public getConfig(moduleName: string, configKey: string) {
        const cacheConfig = this.cacheService.get(`${moduleName}-${configKey}`)
        if (cacheConfig) return cacheConfig
        const newCacheConfig = require(join(this.configService.get<string>('rootPath'), `../assets/${moduleName}/${configKey}`))
        if (newCacheConfig) {
            const result = newCacheConfig.default
            this.cacheService.set(`${moduleName}-${configKey}`, result, 300)
            return result
        }
        return {}
    }

    /**
    * 接口请求通用函数
    * @param options.url 接口路径
    * @param options.data 请求体
    * @param options.headers 请求头
    * @returns 
    */
    public async fetch(options: AxiosRequestConfig): Promise<[Record<string, string> | null, any]> {
        if (!options) return [{
            code: CODES.FETCH_OPTIONS_ERROR,
            message: ERROR_MESSAGE_MAP[CODES.FETCH_OPTIONS_ERROR]
        }, null];

        const { url, data, headers, method = 'POST' } = options
        /**
         * 忽略请求头中带来的content-length
         * 避免因content-length字节数不对导致的下游服务异常
         */
        delete headers['content-length']

        // 在此可以对options内的参数做任意修改...

        try {
            const res = await lastValueFrom(this.httpService.request({
                url,
                method,
                data,
                headers,
            }))
            const err = res.data.code === '0' ? null : { ...res.data, errUrl: url }
            const result = res.data || null;
            return [err, result];
        } catch (error) {
            if (error.response) {
                const { status } = error.response
                switch (status) {
                    case 401:
                        throw new UnauthorizedException()
                    // ......
                }
                return [error.response.data, null];
            }
            return [error, null]
        }
    }
}
