const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class MinRequest {

	[config] = {
		// baseURL: 'http://127.0.0.1:8899',
		baseURL: 'https://www.renduoduo2019.com:888',
		method: 'GET',
		dataType: 'json',
		responseType: 'text'
	}

	interceptors = {
		request: (func) => {
			if (func) {
				MinRequest[requestBefore] = func
			} else {
				MinRequest[requestBefore] = (request) => request
			}
		},
		response: (func) => {
			if (func) {
				MinRequest[requestAfter] = func
			} else {
				MinRequest[requestAfter] = (response) => response
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
		options.dataType = options.dataType || this[config].dataType
		options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
		options.data = options.data
		options.header = { ...options.header
		}
		options.method = options.method || this[config].method

		options = { ...options,
			...MinRequest[requestBefore](options)
		}
		return new Promise((resolve, reject) => {
			options.success = function(res) {
				if ((res.data.message === "身份验证过期" || res.data.message === "登录信息不能为空") && uni.getStorageSync('loginState')) {
					uni.showToast({
						title: '登录信息过期，请重新登录',
						icon: 'none',
						duration: 2000
					});
					uni.setStorageSync('loginState', false);
					uni.setStorageSync('token', null);
				}
				resolve(MinRequest[requestAfter](res))
			}
			options.fail = function(err) {
				if ((err.data.message === "身份验证过期" || err.data.message === "登录信息不能为空") && uni.getStorageSync('loginState')) {
					uni.showToast({
						title: '登录信息过期，请重新登录',
						icon: 'none',
						duration: 2000
					});
					uni.setStorageSync('loginState', false);
					uni.setStorageSync('token', null);
				}
				reject(MinRequest[requestAfter](err))
			}
			uni.request(options)
		})
	}

	get(url, data, options = {}) {
		let token = uni.getStorageSync('token')
		options.url = url
		options.data = data
		options.method = 'GET'
		options.header = {
			'content-type': 'application/json;charset=UTF-8',
			'Authorization': token || ''
		}
		return this.request(options)
	}
	post(url, data, options = {}) {
		let token = uni.getStorageSync('token')
		options.url = url
		options.data = data
		options.method = 'POST'
		options.header = {
			'content-type': 'application/json;charset=UTF-8',
			'Authorization': token || ''
		}
		return this.request(options)
	}
}

export const minRequest = new MinRequest()
