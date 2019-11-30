<template>
	<view id="whole">
		<view id="header">
			<button class="recording" @click="toIncome(1)">提现记录</button>
			<image class="pic" src="../../static/withdraw/ic-提现金额.png"></image>
			<text style="font-size: 23rpx;color: #999999;position: relative;top: 28rpx;left: 280rpx;">
				可提现金额 （元）
			</text>
			<view style="width: 700rpx;text-align: center;font-weight: bold;font-size: 60rpx;position: relative;top: 40rpx;left: 20rpx;">
			{{amount}}
			</view>
		</view>
		<view id="account" class="info">
			<text class="title">支付宝账号</text>
			<input class="inputBox" v-model="paymentAccount" placeholder="请输入支付宝账号"/>
		</view>
		<view class="info">
			<text class="title">真实姓名</text>
			<input class="inputBox" v-model="paymentName" placeholder="请输入支付宝真实姓名"/>
		</view>
		<view class="info">
			<text class="title">密码</text>
			<input class="inputBox" v-model="keyWord" password="true" placeholder="请输入RenDuoDuo登录密码"/>
		</view>
		<view id="wAmount">
			<view style="font-size: 25rpx;padding: 39rpx 0 0 40rpx;">提现金额</view>
			<view style="display: flex;">
				<text style="font-size: 50rpx;margin: 20rpx 0 0 40rpx;">¥</text>
				<input type="number" v-model="paymentAmount" style="width: 550rpx;margin: 33rpx 0 0 30rpx;font-size: 30rpx;" placeholder="请输入提现金额"/>
			</view>
		</view>
		
		<button class="goWithdraw" @click="toSubmit">立即提现</button>
	</view>
</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				amount: 255.34,
				paymentAccount: "",
				paymentName: "",
				keyWord:"",
				paymentAmount: ""
			}
		},
		onLoad(option) {
			this.amount = option.data;
		},
		methods: {
			toIncome(type) {
				uni.navigateTo({
					url:`/pages/income/income?type=${type}`
				})
			},
			toSubmit() {
				if (this.paymentAccount == "") {
					wx.showToast({
					  title: '请填写支付宝账号！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if (this.paymentName == "") {
					wx.showToast({
					  title: '请填写真实姓名！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if (this.keyWord == "") {
					wx.showToast({
					  title: '请填写密码！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if (this.paymentAmount == "") {
					wx.showToast({
					  title: '请填写提现金额！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				this.toWithdraw();
			},
			toWithdraw() {
				api.postData({
					paymentAccount: this.paymentAccount,
					paymentName: this.paymentName,
					keyWord: this.keyWord,
					paymentAmount: this.paymentAmount
				}).then(res => {
					wx.showToast({
					  title: res.data.message,
					  icon: 'none',
					  duration: 1500
					})
				}).catch(_ => {
					console.log(res.data.message)
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
	#whole {
		width:750rpx;
		height: 1200rpx;
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
		margin-top: 230rpx;
		font-size: 30rpx;
		color: white;
		line-height: 88rpx;
		width:670rpx;
		height:88rpx;
		background:rgba(6,193,174,1);
		border-radius:44rpx;
	}
	#wAmount {
		margin-top: 20rpx;
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
		font-size: 20rpx;
		position: relative;
		top: 20rpx;
		left: 280rpx;
		width: 140rpx;
		height: 50rpx;
		background:rgba(6,193,174,1);
		border-radius:44rpx;
	}
	
</style>
