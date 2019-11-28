import {minRequest} from '../../Config/MinRequest'

export class api{
  // 这里统一管理api请求
  static getList(data){
	  return minRequest.get('/api/AppHomePage/selectHomePageRouters',data)
  }
  static getCodeInfo(){
	  	  return minRequest.get('/api/WCPCommodityOrder/getCurrentOrder')
  }
}