import {minRequest} from '../../Config/MinRequest'

// 请求拦截器
// minRequest.interceptors.request((request) => {
//   return request
// })

// // 响应拦截器
// minRequest.interceptors.response((response) => {
//   return response.data
// })

// // 设置默认配置
// minRequest.((config) => {
//   config.baseURL = ''
//   return config
// })

export class api{
  // 这里统一管理api请求
  static sendData(data){
	  return minRequest.post('/api/VipApply/applyWCPVip', data)
  }
  /**
   * 获取用户基本信息
   * 并存入缓存
   * @param {Object} location
   */
  static getUserInfo(location){
  	  return minRequest.get('/api/AppPersonalCenter/appGetUserEnterpriseInfo', location)
  }
  /**
   * 获取申请会员金额
   * @param {Object} location
   */
  static getVipMoney(){
  	  return minRequest.post('/api/VipApply/getVipMoney')
  }
  
  /**
   * 申请会员
   * @param {Object} location
   */
  static buyVIP(){
  	  return minRequest.post('/api/WeChatAppletPaymentVip/WeChatRechargeVip')
  }
}
