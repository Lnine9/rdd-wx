import {minRequest} from '../../Config/MinRequest'
export class api{
  // 这里统一管理api请求
  static getAreas(){
	  return minRequest.get('/api/WCPCommodityInfo/getAreas')
  }
  static getClassification(data){
  	  return minRequest.get('/api/WCPCommodityInfo/getClassification',data)
  }
}