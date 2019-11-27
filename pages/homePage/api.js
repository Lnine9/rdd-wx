import {minRequest} from '../../Config/MinRequest.js'
export class api{
	static getPic(data){
	return	minRequest.get('',data)
	}
	static getRegion(data){
	return	minRequest.get('',data)
	}
}