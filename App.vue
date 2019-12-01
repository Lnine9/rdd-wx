<script>
	import {Json}  from './Json.js'
	import {amap} from './libs/amap-wx.js';
	export default {
		globalData: {  
		    desc: ``  
		},  

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
	page{
		font-family:PingFang SC;
	}
</style>
