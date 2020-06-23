import {minRequest} from '../../Config/MinRequest'

export class api{
  // 这里统一管理api请求
  static getList(commodityId){
	return minRequest.get('/api/WCPCommodityInfo/getOneCommodity', commodityId)
  }
  
  static getData(data){
  	  return minRequest.get('/auth/loginWCP', data)
  }
  
  /**
   * 获取商品id对应的二维码
   * @param {Object} params
   */
  static getQRCodeImg(params) {
  	  return minRequest.get('/api/WCPUserInfo/getWCPCommodityCode', params)
  }
  
  /**
   * 限购
   * @param {Object} params
   */
  static getLimited(params) {
  	  return minRequest.post('/api/WeChatAppletPaymentVip/getLimited', params)
  }
}