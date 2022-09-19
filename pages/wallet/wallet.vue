<template>
	<view>
		<view class="header">
			<view class="left">
				<image class="backImg" src="../../static/wallet/incomeBack.png"></image>
				<view class="incomeType">总收益</view>
				<view class="theIncome">{{wallet.totalIncome.toFixed(2)}}
					<text style="font-size: 35rpx;margin-left: 15rpx;">元</text>
				</view>
			</view>
			<view class="right">
				<image class="backImg" src="../../static/wallet/balance.png"></image>
				<view class="incomeType">余额</view>
				<view class="theIncome">{{wallet.blance.toFixed(2)}}
					<text style="font-size: 35rpx;margin-left: 15rpx;">元</text>
				</view>
			</view>
		</view>
		<view class="incomes" @click="toIncome(0)">
			<view class="income">
				<image class="incomePic" src='../../static/wallet/share.png'></image>会员分享下单收益 （元）
			</view>
			<text class="text">{{wallet.fanyongIncome.toFixed(2)}}</text>
			<image class="arrow" src="../../static/wallet/arrow.png"></image>
		</view>
<!-- 		<view class="incomes" @click="toIncome(9)">
			<view class="income">
				<image class="incomePic" src='../../static/wallet/share.png'></image>其他
			</view>
			<text class="text">{{wallet.otherIncome.toFixed(2)}}</text>
			<image class="arrow" src="../../static/wallet/arrow.png"></image>
		</view> -->
		
		<view class="incomes" @click="moreIncome()">
			<view class="income">
				<icon class="incomePic" type="waiting"></icon></image> 升级个人代理预计奖励（元）
			</view>
			<text class="text">{{wallet.moreIncome?wallet.moreIncome.toFixed(2):0}}</text>
			<image class="arrow" src="../../static/wallet/arrow.png"></image>
		</view>
		
		<view class="incomes" @click="moreIncome()">
			<view class="income">
				<icon class="incomePic" type="waiting"></icon></image> 邀请个人代理预计奖励（元）
			</view>
			<text class="text">{{wallet.moreIncome2?wallet.moreIncome2.toFixed(2):0}}</text>
			<image class="arrow" src="../../static/wallet/arrow.png"></image>
		</view>

		<button class="withdraw" @click="toWithdraw(wallet.blance)">去提现</button>


	</view>
</template>

<script>
	import {
		api
	} from './api.js'
	export default {
		data() {
			return {

				// 初始化数据
				wallet: {
					blance: 0,
					totalIncome: 0,
					shareIncome: 0,
					fanyongIncome: 0,
					otherIncome: 0,
					moreIncome: 0,
					moreIncome2: 0,
				},
				moreIncomeHelp: '',
			}
		},

		// 加载后端数据
		mounted() {
			this.getInfo();
		},

		// 页面的跳转
		methods: {
			moreIncome: function() {
				const content = this.moreIncomeHelp?this.moreIncomeHelp.replace(/<br>/g,"\n"):"";
				uni.showModal({
					title:'更多预期收益说明',
					content:content,
				})
			},
			// 下拉刷新
			onPullDownRefresh: function() {
				wx.showNavigationBarLoading() //在标题栏中显示加载
				this.getInfo() //重新加载数据
				//模拟加载  1秒
				setTimeout(function() {
					// complete
					wx.hideNavigationBarLoading() //完成停止加载
					wx.stopPullDownRefresh() //停止下拉刷新
				}, 1000);
			},
			toWithdraw(data) {
				uni.navigateTo({
					url: `/pages/withdraw/withdraw?data=${data}`
				})
			},
			toIncome(type) {
				uni.navigateTo({
					url: `/pages/income/income?type=${type}`
				})
			},

			// 后端数据的返回
			getInfo() {
				api.getMoreIncomeHelp().then(res=>{
					this.moreIncomeHelp = res.data.data;
				}).catch(()=>{})
				api.getWallet().then(res => {
					console.log(res.data.data);
					if (res.data.data == null) {
						this.wallet.blance = 0;
						this.wallet.totalIncome = 0;
						this.wallet.shareIncome = 0;
						this.wallet.fanyongIncome = 0;
						this.wallet.otherIncome = 0;
						this.wallet.moreIncome = 0;
						this.wallet.moreIncome2 = 0;
					} else {
						this.wallet = res.data.data;
					}

				}).catch(_ => {
					wx.showToast({
						title: '网络繁忙！',
						icon: 'none',
						duration: 1500
					})
				})
			}


		}
	}
</script>

<style>
	page {
		padding-bottom: 50rpx;
		background: rgba(248, 249, 251, 1);
	}

	.backImg {
		float: right;
		width: 110rpx;
		height: 125rpx;
	}

	.left {
		width: 320rpx;
		height: 216rpx;
		background: rgba(91, 124, 255, 1);
		border-radius: 20rpx;
	}

	.incomes {
		margin-top: 3rpx;
		display: flex;
		width: 750rpx;
		background-color: #FFFFFF
	}

	.right {
		width: 320rpx;
		height: 216rpx;
		background: rgba(6, 193, 174, 1);
		border-radius: 20rpx;
	}

	.theType {
		font-size: 25rpx;
	}

	.header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 750rpx;
		height: 336rpx;
		background: rgba(255, 255, 255, 1);
	}

	.income {
		color: #333333;
		padding-left: 50rpx;
		line-height: 130rpx;
		font-weight: bold;
		font-size: 30rpx;
		width: 600rpx;
		height: 130rpx;
		background: rgba(255, 255, 255, 1);
	}

	.incomePic {
		position: relative;
		top: 6rpx;
		margin-right: 30rpx;
		padding-top: 20rpx;
		width: 39rpx;
		height: 37rpx;
	}

	#money {
		float: right;
		font-size: 30rpx;
		padding-right: 120rpx;
	}

	.withdraw {
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

	.incomeType {
		margin: 38rpx 0 0 50rpx;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	.theIncome {
		margin: 50rpx 0 0 50rpx;
		font-size: 35rpx;
		color: #FFFFFF;
		display: flex;
	}

	.text {
		margin-right: 30rpx;
		line-height: 130rpx;
		font-size: 25rpx;
		font-family:  ;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
	}

	.arrow {
		padding: 55rpx 45rpx 0 0;
		width: 13rpx;
		height: 23rpx;
	}
</style>
