<template>
	<view class="index">
		<view class="navbak">
			<view class="bak-btn" @click="back">返回</view>
		</view>
		<view class='qrcode-box'>
			<view class="title">
				<text class="batch">{{batchName}}</text>
				<text class="building">{{building}}</text>
			</view>
			<view class='qrcode-canvas-view'>
				<image class='qrcode-canvas' :src="QR"></image>
				<view class="logomask"></view>
			</view>
		</view>
		<view class="info">
			<text class="donum">{{donum}}</text>
			<text class="divider">/</text>
			<text class="total">{{total}}</text>
			<text class="refresh" @click="refresh">刷新</text>
		</view>
		<view class='qrcode-opretion'>
			<button @click='end' class='end-btn'>结束</button>
		</view>
	</view>
</template>

<script>
	import {api} from './api'
	export default {
		data() {
			return {
				canvasId: 'sqrcode',
				QR: '', // 二维码
				building: undefined,
				batchId: undefined,
				historyId: undefined,
				donum: undefined,
				total: undefined,
				batchName: undefined,
				qrText: undefined,
				timer: undefined,
			}
		},
		onLoad (options) {
			this.historyId = options.historyId
			
			this.getHistory()
		},
		onShow() {
			this.doCreateQRCode()
			this.timer = setInterval(this.getHistory, 8000);
		},
		onHide() {
			clearInterval(this.timer)
		},
		methods: {
			doCreateQRCode () {
				console.log(this.historyId);
				if (!this.historyId) {
					uni.showToast({
						icon: 'error',
						title: '信息错误，请刷新',
						duration: 2000
					})
					return
				}
				// 生成二维码
				uni.showLoading({
					title: '正在生成...',
				})
				const that = this
				api.getQR({
					historyId: this.historyId
				}).then(res => {
					console.log(res);
					if (res.data){
						that.QR = 'data:image/PNG;base64,' + res.data
					} else {
						uni.showToast({
							title: '生成二维码失败，请重试',
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: '网络错误，请稍后重试',
						icon: 'none'
					})
				})
				uni.hideLoading()
			},
			refresh() {
				this.getHistory()
				this.$nextTick((that) => {
					that.doCreateQRCode()
				})
			},
			getHistory() {
				const that = this
				api.getHistory({
					historyId: this.historyId
				}).then(res => {
					if (res.data.code == 200) {
						that.batchName = res.data.data.batch
						that.building = res.data.data.building
						that.donum = res.data.data.completeNum
						that.total = res.data.data.studentNum
					} else {
						uni.showToast({
							title: "参数错误，请重新打开",
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: "网络错误，请稍后重试",
						icon: 'none'
					})
				})
			},
			back() {
				uni.navigateBack({
					 delta: 1 // 返回的页面数
				})
			},
			end() {
				api.end({
					historyId: this.historyId
				}).then(res => {
					if (res.data.code == 200) {
						this.back()
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err);
					uni.showToast({
						title: "网络错误，请稍后重试",
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style scoped>
	.navbak{
		width: 100%;
		height: 30px;
		background-color: #fff;
	}
	.bak-btn{
		height: 30px;
		line-height: 34px;
		font-weight: bold;
		width: 70px;
		font-size: 16px;
		color: #5b5b5b;
		padding: 0 10px;
	}
	
	.index{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.title{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.batch{
		font-size: 16px;
		color: #fff;
	}
	
	.building{
		font-size: 28px;
		font-weight: bold;
		color: #ffd427;
	}
	
	.donum{
		font-size: 22px;
		font-weight: bold;
		color: #5b5b5b;
	}
	.info{
		transform: translateX(16px);
	}
	.divider{
		font-size: 20px;
		margin: 0 5px;
	}
	.total{
		font-size: 16px;
		color: #7b7b7b;
	}
	.refresh{
		display: inline-block;
		padding: 4px 5px;
		margin-left: 5px;
		font-size: 16px;
		color: #22b2ff;
	}
	
	.qrcode-box {
		font-size: 28rpx;
		width: 100%;
		background-color: #6e7e8c;
		margin: 20rpx auto;
		padding: 40rpx;
		box-sizing: border-box;
		box-shadow: 0 5px 30px #cbcbcb50;
	}
	.qrcode-canvas-view {
		position: relative;
		height: 456rpx;
		width: 456rpx;
		margin: 40rpx auto;
		border: solid 1rpx #ccc;
	}
	.qrcode-canvas {
		margin: 2rpx;
		height: 450rpx;
		width: 450rpx;
	}
	.logomask {
		position: absolute;
		z-index: 10000;
		width: 200rpx;
		height: 200rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #6e7e8c;
		border-radius: 220rpx;
	}
	
	.qrcode-opretion {
		position: absolute;
		bottom: 200rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 300rpx;
		padding: 50rpx 68rpx 0rpx;
	}
	
	.end-btn {
		height: 82rpx;
		border-radius: 41rpx;
		background-color: #ff2163;
		box-shadow: -1px 12px 11px 0px #ff216350;
		text-align: center;
		line-height: 82rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #fff;
	}

</style>
