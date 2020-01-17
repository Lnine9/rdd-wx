import {minRequest} from '../../Config/MinRequest'


export class api{
  // 这里统一管理api请求
  /**
   * 获取精选商品 & 猜你喜欢列表
   * @param {Object} userAndLocalMes
   */
  static getProducts(){
  	  return minRequest.get('/api/WCPCommodityInfo/getCommodityTitleList')
  } 
  
  static selectDict(data){
  	  return minRequest.get('/auth/getDicByName',data)
  }
}