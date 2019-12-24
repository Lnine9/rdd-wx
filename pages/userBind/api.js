import {minRequest} from '../../Config/MinRequest'
export class api{
  // 这里统一管理api请求
  static bindingUser(data){
	  return minRequest.post('/api/userManagement/bindingUser',data)
  }
}