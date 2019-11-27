import {minRequest} from '/Config/MinRequest.js'
export class api{
	static getPic(data){
	return	minRequest.get('',data)
	}
}