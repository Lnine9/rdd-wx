import {minRequest} from '../../Config/MinRequest'

export class api{
  // 这里统一管理api请求
  static getData(data){
	  return minRequest.get('/api/personCenter/getBalance', data)
  };
  static getWallet(data){
  	  return minRequest.get('/api/AppPersonalCenter/getUserIncomeInfo', data)
  }
  static getMoreIncomeHelp(){
	  return minRequest.get('/api/AppPersonalCenter/getMoreIncomeHelp')
  }
}