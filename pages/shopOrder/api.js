import {minRequest} from '../../Config/MinRequest'
export class api{
  // 这里统一管理api请求
  static getAllCommodityOrderByLeader(data){
	  return minRequest.get('/api/WCPCommodityOrder/getAllCommodityOrderByLeader',data)
  }
  static comfirmOrder(data){
  	  return minRequest.post('/api/WCPCommodityOrder/comfirmWCPCommodityOrder',data)
  }
}	