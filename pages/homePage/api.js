import {minRequest} from '../../Config/MinRequest'

export class api{

  /**
   * 获取用户基本信息
   * 并存入缓存
   * @param {Object} location
   */
  static getUserInfo(location){
	  return minRequest.get('/api/AppPersonalCenter/appGetUserEnterpriseInfo', location)
  }
  
  /**
   * 获得轮播图数据
   * @param {Object} locationCode
   */
  static getBannerImgs(locationCode){
  	  return minRequest.get('/api/AppHomePage/selectAnnouncement', locationCode)
  }
  
  /**
   * 获取精选商品 & 猜你喜欢列表
   * @param {Object} userAndLocalMes
   */
  static getProducts(userAndLocalMes){
  	  return minRequest.get('/api/WCPCommodityInfo/getCommodityList', userAndLocalMes)
  } 
}