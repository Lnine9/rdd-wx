const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class YQRequest {

	[config] = {
		// baseURL: 'http://127.0.0.1:8899',
		baseURL: 'https://renduoduo2019.com:8059',
	}

	interceptors = {
		request: (func) => {
			if (func) {
				YQRequest[requestBefore] = func
			} else {
				YQRequest[requestBefore] = (request) => request
			}
		},
		response: (func) => {
			if (func) {
				YQRequest[requestAfter] = func
			} else {
				YQRequest[requestAfter] = (response) => response
			}
		}
	}

	static[requestBefore](config) {
		return config
	}

	static[requestAfter](response) {
		return response
	}

	static[isCompleteURL](url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	setConfig(func) {
		this[config] = func(this[config])
	}

	request(options = {}) {
		options.baseURL = options.baseURL || this[config].baseURL
		options.url = YQRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
		options.data = options.data
		options.header = { ...options.header
		}
		options.method = options.method || this[config].method

		options = { ...options,
			...YQRequest[requestBefore](options)
		}
		return new Promise((resolve, reject) => {
			options.success = function(res) {
				resolve(YQRequest[requestAfter](res))
			}
			options.fail = function(err) {
				reject(YQRequest[requestAfter](err))
			}
			uni.request(options)
		})
	}

	get(url, data, options = {}) {
		// let token = uni.getStorageSync('token')
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	}
	post(url, data, options = {}) {
		// let token = uni.getStorageSync('token')
		options.url = url
		options.data = data
		options.method = 'POST'
		options.header = {
			// 'content-type': 'application/json;charset=UTF-8',
			// 'Authorization': token || ''
		}
		return this.request(options)
	}
}

export const yqRequest = new YQRequest()
