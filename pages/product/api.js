import {minRequest} from '../../Config/MinRequest'

export class api{
  // 这里统一管理api请求
  static getList(commodityId){
	return minRequest.get('/api/WCPCommodityInfo/getOneCommodity', commodityId)
  }
  
  static getData(data){
  	  return minRequest.get('/auth/loginWCP', data)
  }
}