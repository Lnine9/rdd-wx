import {minRequest} from '../../Config/MinRequest'
export class api{
  // 这里统一管理api请求
  static getData(data){
	  return minRequest.get('/api/userAddress/getAddressList', data)
  }
  static addAddress(data){
	  return minRequest.post('/api/userAddress/addAddress',data)
  }
  static modifyAddress(data){
	  return minRequest.post('/api/userAddress/modifyAddress',data)
  }
  static setDefaultAddress(data){
	  return minRequest.post('/api/userAddress/setDefaultAddress',data)
  }
}