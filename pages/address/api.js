import {minRequest} from '../../Config/MinRequest'
export class api{
  // 这里统一管理api请求
  static getData(data){
	  return minRequest.get('/api/StudentManage/getAllStudent', data)
  }
}