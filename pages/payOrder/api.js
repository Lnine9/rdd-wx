import {minRequest} from '../../Config/MinRequest'

export class PayOrderAPI {
	/**
	 * 获取商品信息
	 * @param {Object} params
	 */
	static getCommodityInfo(params) {
	  return minRequest.get('/api/WCPCommodityInfo/getOneCommodity', params)
	}
	
	/**
	 * 获取用户默认收货地址
	 * @param {Object} params
	 */
	static getDefaultAddress(params) {
	  return minRequest.get('', params)
	}
	
	/**
	 * 支付订单
	 * @param {Object} params
	 */
	static payOrder(params) {
	  return minRequest.get('', params)
	}
}
