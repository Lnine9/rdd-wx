<template>
	<view>
		<view id="header">
			<button class="recording" @click="toIncome(1)">提现记录</button>
			<image class="pic" src="../../static/withdraw/withdraw.png"></image>
			<text style="font-size: 23rpx;color: #999999;position: relative;top: 28rpx;left: 270rpx;">
				可提现金额 （元）
			</text>
			<view style="width: 700rpx;text-align: center;font-weight: bold;font-size: 60rpx;position: relative;top: 40rpx;left: 20rpx;">
			{{amount.toFixed(2)}}
			</view>
		</view>
		
		<view id="wAmount">
			<view style="font-size: 25rpx;padding: 39rpx 0 0 40rpx;">提现金额</view>
			<view id="theInput" style="display: flex;">
				<text style="font-size: 50rpx;margin: 20rpx 0 0 40rpx;">¥</text>
				<input type="text" v-model="paymentAmount" style="width: 550rpx;margin: 35rpx 0 0 30rpx;font-size: 30rpx;" placeholder="请输入提现金额"/>
			</view>
			<view id="line"></view>
		</view>
		
		<button class="goWithdraw" @click="toSubmit">立即提现</button>
	</view>
</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				amount: 0,
				paymentAccount: "",
				paymentAmount: "",
				wxName: '',
				openId: '',
			}
		},
		
		onShow(){
			this.getOpenId()
			let user = uni.getStorageSync('USER_PROFILE')
			if(user){
				this.wxName = user.nickName
			} else {
				this.getUserProfile()
			}
		},
	
		
		// 上一个页面传来的值
		onLoad(option) {
			if (option.data == null) {
				this.amount = 0;
			} else {
				this.amount = parseFloat(option.data);
			}
		},
		methods: {
			getOpenId(){
				const _this = this;
				wx.login({
				      success: function (res) {
				        api.getOpenId({code: res.code}).then(res=>{
				        	console.log(res);
				        	if(res.statusCode == 200){
				        		_this.openId = res.data
				        	} else{
				        		uni.showToast({
				        			title: '获取OpenId失败，请尝试重新登录',
				        			icon: 'error',
				        			duration: 2000
				        		});
				        	}
				        })
				      }
				    })
			},
			
			getUserProfile(){
				let _this = this;
				uni.showModal({
					  title: '温馨提示',
					  content: '授权微信登录获取用户信息',
					  success(res) {
						console.log(res)
						//如果用户点击了确定按钮
						if (res.confirm) {
						  uni.getUserProfile({
						      desc:'Wexin',
						      success: function(infoRes) {
						         _this.wxName = infoRes.userInfo.nickName; //昵称
								console.log(infoRes)
								uni.setStorageSync('USER_PROFILE', infoRes.userInfo)
						      },
						      fail(res) {
						  		console.log(res);
						  		uni.showModal({
						  			content: '失败了',
						  			showCancel: true
						  		});
						  	}
						  });
						} else if (res.cancel) {
						  //如果用户点击了取消按钮
						  uni.showToast({
							title: '您拒绝了请求,不能正常使用提现功能',
							icon: 'error',
							duration: 2000
						  });
						  return;
						}
					  }
					});
			},
			
			// 页面的跳转
			toIncome(type) {
				uni.navigateTo({
					url:`/pages/income/income?type=${type}`
				})
			},
			
			// 提交数据并验证
			toSubmit() {
				if (this.paymentAmount == "") {
					wx.showToast({
					  title: '请填写提现金额！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if (this.paymentAmount < 1) {
					wx.showToast({
					  title: '提现金额不能小于1元',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				// if (this.paymentAmount < 10) {
				// 	wx.showToast({
				// 	  title: '满10元才支持提现哟！',
				// 	  icon: 'none',
				// 	  duration: 2000
				// 	})
				// 	return;
				// }
				if (this.paymentAmount > this.amount) {
					wx.showToast({
					  title: '输入金额过大！',
					  icon: 'none',
					  duration: 2000
					})
					return;
				}
				if(!/^\d+(\.\d{0,2})?$/.test(this.paymentAmount)) {
					wx.showToast({
					  title: '输入金额只能为整数或者两位小数！',
					  icon: 'none',
					  duration: 2000
					})
					return;
				}
				this.toWithdraw();
			},
			
			// 后端数据的返回
			toWithdraw() {
				console.log(this.openId, this.wxName);
				if(!this.openId){
					this.getOpenId()
					return;
				}
				
				if(!this.wxName){
					this.getUserProfile();
					return;
				}
			
				api.postData({
					wxName: this.wxName,
					amount: this.paymentAmount,
					openId: this.openId,
				}).then(res => {
					uni.showToast({
					  title: res.data.message,
					  icon: 'none',
					  duration: 3000
					});
					if(res.data.code == 200){
						this.amount = this.amount-this.paymentAmount
						this.paymentAccount = ''
						nui.navigateBack({
							delta:1
						})
					}
					
				}).catch(_ => {
					uni.showToast({
					  title: '网络错误',
					  icon: 'none',
					  duration: 4000
					})
				})
			}
		}
	}
</script>

<style>
	.pic {
		position: relative;
		top: 40rpx;
		left: 240rpx;
		width: 43rpx;
		height: 43rpx;
	}
	page {
		padding-bottom: 50rpx;
		background:rgba(248,249,251,1);
	}
	#header {
		width:749rpx;
		height:286rpx;
		background:rgba(255,255,255,1);
	}
	.title {
		width: 150rpx;
		color: #303038;
		margin-left: 35rpx;
	}
	.info {
		display: flex;
		line-height: 110rpx;
		font-size: 28rpx;
		margin-top: 2rpx;
		width:750rpx;
		height:110rpx;
		background-color: rgba(255,255,255,1);
	}
	#account {
		margin-top: 30rpx;
	}
	.goWithdraw {
		position: fixed;
		left: 24rpx;
		right: 30rpx;
		bottom: 50rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 670rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		background-color: #06C1AE;
		border-radius: 40rpx;	
	}
	#wAmount {
		margin-top: 15rpx;
		width:749rpx;
		height:200rpx;
		background:rgba(255,255,255,1);
	}
	.inputBox {
		font-size: 25rpx;
		text-align: right;
		margin: 40rpx 0 0 0rpx;
		width: 520rpx;
	}
	.recording {
		line-height: 60rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		position: relative;
		top: 10rpx;
		left: 260rpx;
		width: 160rpx;
		height: 60rpx;
		background:rgba(6,193,174,1);
		border-radius:60rpx;
	}
	
	#line {
		background-color: #F3F3F3;
		width: 670rpx;
		height: 2rpx;
		margin-left: 40rpx;
	}
	
	
</style>
