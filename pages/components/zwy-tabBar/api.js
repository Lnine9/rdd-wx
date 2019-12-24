import {minRequest} from '../../../Config/MinRequest'

export class api{
  static getTabBarInfo(data){
	  return minRequest.get('/api/WCPUserInfo/getTabBarInfo', data)
  }


}
