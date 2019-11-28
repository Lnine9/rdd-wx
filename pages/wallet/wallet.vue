<template>
	<view class="whole">
		<view class="header">
			<view class="left">
				<image class="backImg" src="../../static/wallet/ic-收益背景图.png"></image>
				<view class="incomeType">总收益</view>
				<view class="theIncome">{{this.wallet.totalIncome}}
				<text style="font-size: 28rpx;margin-left: 15rpx;">元</text>
				</view>
				</view>
			<view class="right">
				<image class="backImg" src="../../static/wallet/ic-余额背景图.png"></image>
				<view class="incomeType">余额</view>
				<view class="theIncome">{{this.wallet.balance}}
				<text style="font-size: 28rpx;margin-left: 15rpx;">元</text>
				</view>
				</view>
		</view>
		<view class="incomes">
			<view class="income">
				<image class="incomePic" src='../../static/wallet/ic-推荐收益.png'></image>推荐收益 （元）
				</view>
				<text class="text">{{this.wallet.shareIncome}}</text>
				<image class="arrow" src="../../static/wallet/arrow.png"></image>
			</view>
		
			<navigator url="../index/index">
				<view class="incomes">
					<view class="income">
						<image class="incomePic" src='../../static/wallet/ic-返佣收益.png'>返佣收益 （元）
					</view>
					<text class="text">{{this.wallet.fanyongIncome}}</text>
					<image class="arrow" src="../../static/wallet/arrow.png"></image>
				</view>
			</navigator>
			<view class="incomes">
				<view class="income">
					<image class="incomePic" src='../../static/wallet/ic-其他收益.png'>其他收益 （元）
					</view>
					<text class="text">{{this.wallet.otherIncome}}</text>
					<image class="arrow" src="../../static/wallet/arrow.png"></image>
			</view>
			<navigator url="../withdraw/withdraw">
				<button class="withdraw">去提现</button>
			</navigator>
	</view>
</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				wallet: {
					totalIncome: 0,
					balance: 0,
					shareIncome: 0,
					fanyongIncome: 0,
					otherIncome: 0
				}
			}
		}
	}
</script>

<style>
	.backImg {
		float: right;
		width: 110rpx;
		height: 125rpx;
	}
	.left {
		width:320rpx;
		height:216rpx;
		background:rgba(91,124,255,1);
		border-radius:20rpx;
	}
	.incomes {
		margin-top: 3rpx;
		display: flex;
		width: 750rpx;
		background-color: #FFFFFF
	}
	.right {
		width:320rpx;
		height:216rpx;
		background:rgba(6,193,174,1);
		border-radius:20rpx;
	}
	.theType {
		font-size: 25rpx;
	}
	.whole {
		width:750rpx;
		height:1206rpx;
		background:rgba(248,249,251,1);
	}
	.header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width:750rpx;
		height:336rpx;
		background:rgba(255,255,255,1);
	}
	.income {
		color: #333333;
		padding-left: 50rpx;
		line-height: 130rpx;
		font-weight: bold;
		font-size: 30rpx;
		width:600rpx;
		height:130rpx;
		background:rgba(255,255,255,1);
	}
	.incomePic {
		position: relative;
		top: 6rpx;
		margin-right: 30rpx;
		padding-top: 20rpx;
		width: 39rpx;
		height: 37rpx;
	}
	#money{
		float: right;
		font-size: 30rpx;
		padding-right: 120rpx;
	}
	.withdraw {
		margin-top: 380rpx;
		font-size: 30rpx;
		color: white;
		line-height: 88rpx;
		width:670rpx;
		height:88rpx;
		background:rgba(6,193,174,1);
		border-radius:44rpx;
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
	}
	.text {
		margin-right: 30rpx;
		line-height: 130rpx;
		font-size:30rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(102,102,102,1);
	}
	.arrow {
		padding: 55rpx 45rpx 0 0;
		width: 13rpx;
		height: 23rpx;
	}
</style>
