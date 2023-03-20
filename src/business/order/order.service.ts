import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InfraService } from '../../core/service/infra.service'

@Injectable()
export class OrderService {
    constructor(
        // 用于获取配置
        private readonly configService: ConfigService,
        // 调用基础方法
        private readonly infraService: InfraService,
    ) { }

    // 接口的具体实现
    public async getOrderDetail(orderId: string, headers: Record<string, string>) {
        if (!orderId) throw new BadRequestException('缺少订单ID')
        // 从订单域中根据订单ID获取指定订单信息
        const [orderInfoErr, orderInfo] = await this.infraService.fetch({
            url: `${this.configService.get<string>('server.Order')}/orderInfo`,
            data: { orderId },
            headers,
        })
        if (orderInfoErr) {
            throw new InternalServerErrorException(orderInfoErr.message)
        }

        // 从产品域中根据产品代码获取指定产品信息
        const { productCode, policyID } = orderInfo
        const [productInfoErr, productInfo] = await this.infraService.fetch({
            url: `${this.configService.get<string>('server.Product')}/productInfo`,
            data: { productCode },
            headers,
        })
        if (productInfoErr) {
            throw new InternalServerErrorException(productInfoErr.message)
        }

        // 从保险域中根据保单号获取指定保单信息
        const [policyInfoErr, policyInfo] = await this.infraService.fetch({
            url: `${this.configService.get<string>('server.Insure')}/policyInfo`,
            data: { policyID },
            headers,
        })
        if (policyInfoErr) {
            throw new InternalServerErrorException(policyInfoErr.message)
        }

        // 完成所有信息的获取后可以按需拼接返回给前端
        return {
            ...orderInfo,
            productInfo,
            policyInfo,
        }
    }
}
