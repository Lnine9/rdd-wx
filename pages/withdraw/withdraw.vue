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
		<!-- <view id="account" class="info">
			<text class="title">支付宝账号</text>
			<input class="inputBox" v-model="paymentAccount" placeholder="请输入支付宝账号"/>
		</view>
		<view class="info">
			<text class="title">真实姓名</text>
			<input class="inputBox" v-model="paymentName" placeholder="请输入支付宝真实姓名"/>
		</view> -->
		
		<view id="wAmount">
			<view style="font-size: 25rpx;padding: 39rpx 0 0 40rpx;">提现金额</view>
			<view id="theInput" style="display: flex;">
				<text style="font-size: 50rpx;margin: 20rpx 0 0 40rpx;">¥</text>
				<input type="number" v-model="paymentAmount" style="width: 550rpx;margin: 35rpx 0 0 30rpx;font-size: 30rpx;" placeholder="请输入提现金额"/>
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
				paymentName: "",
				keyWord:"",
				paymentAmount: ""
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
			
			// 页面的跳转
			toIncome(type) {
				uni.navigateTo({
					url:`/pages/income/income?type=${type}`
				})
			},
			
			// 提交数据并验证
			toSubmit() {
				// if (this.paymentAccount == "") {
				// 	wx.showToast({
				// 	  title: '请填写支付宝账号！',
				// 	  icon: 'none',
				// 	  duration: 1500
				// 	})
				// 	return;
				// }
				// if (this.paymentName == "") {
				// 	wx.showToast({
				// 	  title: '请填写真实姓名！',
				// 	  icon: 'none',
				// 	  duration: 1500
				// 	})
				// 	return;
				// }
				if (this.paymentAmount == "") {
					wx.showToast({
					  title: '请填写提现金额！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if (this.paymentAmount < 0) {
					wx.showToast({
					  title: '提现金额不能为负数！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if (this.paymentAmount < 10) {
					wx.showToast({
					  title: '满10元才支持提现哟！',
					  icon: 'none',
					  duration: 2000
					})
					return;
				}
				if (this.paymentAmount > this.amount) {
					wx.showToast({
					  title: '输入金额过大！',
					  icon: 'none',
					  duration: 2000
					})
					return;
				}
				this.toWithdraw();
			},
			
			// 后端数据的返回
			toWithdraw() {
				wx.showToast({
				  title: '快速提现，请添加客服微信  ~  ( cqrdd2019 )',
				  icon: 'none',
				  duration: 4000
				})
				// api.postData({
				// 	paymentAccount: this.paymentAccount,
				// 	paymentName: this.paymentName,
				// 	keyWord: "000000",
				// 	paymentAmount: this.paymentAmount
				// }).then(res => {
				// 	console.log(typeof res.data.data);
				// 	wx.showToast({
				// 	  title: res.data.data,
				// 	  icon: 'none',
				// 	  duration: 1500
				// 	})
				// 	if (res.data.data.equals("提现成功")) {
				// 		wx.navigateBack({
				// 			delta:1
				// 		})
				// 	}
				// }).catch(_ => {
				// 	wx.showToast({
				// 		title: '网络繁忙！',
				// 		icon: 'none',
				// 		duration: 1500
				// 	})
				// })
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
