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
}