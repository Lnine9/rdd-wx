import {minRequest} from '../../Config/MinRequest'

export class OrderDetailAPI {
	/**
	 * 获取订单详情
	 * @param {Object} params
	 */
	static getOrderDetail(params) {
	  return minRequest.get('/api/WCPCommodityOrder/getOneCommodityOrder', params)
	}

	/**
	 * 邮寄确认收货
	 * @param {Object} params
	 */
	static confirmDelivery(params) {
	  return minRequest.post('/api/WCPCommodityOrder/comfirmDeliveryState', params)
	}
}
