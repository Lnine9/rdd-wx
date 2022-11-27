import {yqRequest} from '../../Config/YQRequest'
export class api{
  // 这里统一管理api请求
  static getHistory(data){
	  return yqRequest.get('/history/getTestHistory',data)
  }
  static end(data){
  	  return yqRequest.post('/history/completeTestHistory',data)
  }
  static getQR(data){
  	  return yqRequest.get('/student/getQRCode',data)
  }
}	