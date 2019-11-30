import {minRequest} from '../../Config/MinRequest'

export class api{
  // 这里统一管理api请求
  static getComidityList(){
	  return minRequest.get('/api/WCPCommodityOrder/getAllCommodityOrder')
  }
}