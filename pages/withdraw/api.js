import {minRequest} from '../../Config/MinRequest'

export class api{
  // 这里统一管理api请求
  static postData(data){
	  return minRequest.post('/api/personCenter/myWallet/wspWithDrawToWeChat', data)
  }
}