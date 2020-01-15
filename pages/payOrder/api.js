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
	 */
	static getDefaultAddress() {
	  return minRequest.get('/api/userAddress/getDefaultAddress')
	}
	
	/**
	 * 支付订单
	 * @param {Object} params
	 */
	static payOrder(params) {
	  return minRequest.post('/api/WeChatAppletVip/WeChatApplet', params)
	}
	
	/**
	 * 获取购买成功的消息
	 * @param {Object} params
	 */
	static getSendMessage() {
	  return minRequest.post('/api/wxController/sendMessage')
	}
}
