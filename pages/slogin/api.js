import {yqRequest} from '../../Config/YQRequest'
export class api{
  // 这里统一管理api请求
  static bind(data){
	  return yqRequest.post('/student/bindStudent',data)
  }
  static scan(data){
  	  return yqRequest.post('/student/studentScanCode',data)
  }
  static getWxid(data){
	  console.log(data);
  	  return yqRequest.get('/user/getUserInfo',data)
  }
}	