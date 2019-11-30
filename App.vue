<script>
	import {Json}  from './Json.js'
	import {amap} from './libs/amap-wx.js';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let token = uni.getStorageSync('token') || '';
			if(token){
				//更新登陆状态
				uni.getStorage({
					key: 'token',
					success: (res) => {
						this.login(res.data);
					}
				});
			};
			/**
			 * 获取设备定位
			 */
			let amapPlugin =  null;
			this.amapPlugin = new amap.AMapWX({
			    key: this.key  
			});  
			
			uni.showLoading({  
				title: '获取信息中'  
			});  
			// this.amapPlugin.getRegeo({  
			this.amapPlugin.getPoiAround({  
				success: (data) => {  
					console.log(data)  
					uni.hideLoading();  
					this.addressName = data.poisData[0].cityname;  
					console.info("asdfasdfasdf" + data.poisData[0].cityname)
					uni.setStorageSync('location', this.addressName)
				},
				fail: (res) => {
					console.log(res)  
				}
			}); 	
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
