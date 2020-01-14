import {minRequest} from '../../Config/MinRequest'
export class api{
  // 这里统一管理api请求
  static getAreas(data){
	  return minRequest.get('/api/WCPCommodityInfo/getAreas')
  }
  static getAreas(data){
  	  return minRequest.get('/api/WCPCommodityInfo/getAreas')
  }
}