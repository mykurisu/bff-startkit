import * as COS from 'cos-nodejs-sdk-v5'
import * as STS from 'qcloud-cos-sts'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CacheService } from './cache.service'

@Injectable()
export class CosService {
    private cosInstance: COS

    constructor(
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
    ) {
        const { secretId, secretKey } = this.configService.get('cos')
        this.cosInstance = new COS({
            SecretId: secretId,
            SecretKey: secretKey,
        })
    }

    public async handleCosSts(bucket: string = 'bucket-00000000') {
        const CACHE_KEY = bucket === 'bucket-00000000' ? 'STS-KEYS' : bucket
        const cache = this.cacheService.get(CACHE_KEY)
        if (cache) return cache

        const { secretId, secretKey, region } = this.configService.get('cos')
        const [shortBucketName, appId] = bucket.split('-')
        const allowActions = [
            'name/cos:PutObject',
            'name/cos:PostObject',
        ]
        const policy = {
            version: '2.0',
            statement: [{
                action: allowActions,
                effect: 'allow',
                principal: { 'qcs': ['*'] },
                resource: [
                    `qcs::cos:${region}:uid/${appId}:prefix//${appId}/${shortBucketName}/*`,
                ],
            }],
        }
        return new Promise((resolve, reject) => {
            STS.getCredential({
                secretId,
                secretKey,
                proxy: '',
                durationSeconds: 1800,
                policy,
            }, (err, tempKeys) => {
                if (err) reject(err)
                this.cacheService.set(CACHE_KEY, tempKeys, 1700)
                resolve(tempKeys)
            });
        })
    }

    public async getAuthUrl(fileKey: string) {
        const { bucket, region } = this.configService.get('cos')
        return new Promise((resolve, reject) => {
            this.cosInstance.getObjectUrl({
                Bucket: bucket,
                Region: region,
                Key: fileKey,
                Query: {
                    'imageMogr2/format/webp': '',
                }
            }, (err, data) => {
                if (err) reject(err)
                resolve(data.Url)
            })
        })
    }
}
