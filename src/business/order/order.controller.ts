import { Controller, Post, Body, Headers } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { OrderService } from './order.service'

@ApiTags('订单相关接口')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }
  @Post('getOrderDetail')
  @ApiResponse({
    status: 201,
    description: '获取订单详情',
  })
  async getOrderDetail(
    @Headers() headers: Record<string, string>,
    @Body('orderId') orderId: string,
  ) {
    const res = await this.orderService.getOrderDetail(orderId, headers)
    return res
  }
}
