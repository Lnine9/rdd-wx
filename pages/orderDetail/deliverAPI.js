import {minRequest} from '../../Config/MinRequest'

export class DeliverAPI {
	/**
	 * 获取物流信息
	 * @param {Object} params
	 */
	static getDeliverInfo(params) {
	  return minRequest.post('/api/petrolDelivery/selectLogistics', params)
	}
}
