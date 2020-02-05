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
	  return minRequest.get('/api/WCPCommodityOrder/comfirmDeliveryState', params)
	}
	
	/**
	 * 获取物流信息
	 * @param {Object} params
	 */
	static getDeliverInfo(params) {
	  return minRequest.post('/api/petrolDelivery/selectLogistics', params)
	}
}
