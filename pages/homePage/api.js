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
  
  /**
   * 获取地址列表
   */
  static getAreas(){
  	  return minRequest.get('/api/WCPCommodityInfo/getAreas')
  }
  
  /**
   * 获取商品分类数据
   */
  static getHomepageRouter(params){
	  params.userType = 0;
	  
  	  return minRequest.get('/api/AppHomePage/selectHomePageRouters', params)
  }
  
  
}