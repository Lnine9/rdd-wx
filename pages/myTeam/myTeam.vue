<template>
	<view>
		<view v-show="showType">
			<image src="../../static/income/noIncome.png" class="noImg"></image>
			<text class="noIncome">暂无团队</text>
		</view>
		<view style="width: 500rpx;height: 186rpx;position: relative">
			<image src="../../static/income/fanIncome.png" class="img"></image>
			<view class="name">{{user.userName}}</view>
		</view>
		<view class="list" v-if="item.amount!=0" v-for="(item, index) in team" :key="index" v-show="!showType">
			<view style="width: 500rpx;height: 186rpx;position: relative">
				<image src="../../static/income/fanIncome.png" class="img"></image>
				<view class="userName">{{item.userName}}</view>
				<view class="createAt">{{item.createAt}}</view>
			</view>
			<text class="remark">累积收益:</text>
			<text class="amount">{{item.amount}}</text>
		</view>
	</view>
</template>

<script>
	import {api} from './api.js'
	export default {
		data() {
			return {
				user:{
					userName:'马杰'
				},
				showType:false,
				team:[ {
						userName:'李焱焱',
						createAt:'2019-05-12 23:40:32',
						amount:'500'
					},{
						userName:'王亚亚',
						createAt:'2019-05-02 23:40:32',
						amount:'50'
					},{
						userName:'肖阳阳',
						createAt:'2019-11-11 11:11:11',
						amount:'111'
					}
				],
				}
			},
			onLoad() {
				this.getTeam();
			},
			methods:{
				getTeam(){
					api.getList({
						userId:'700973191457043576'
					}).then(res =>{
						console.log(res)
					}).catch(err => {
						console.log(err)
					})
				}
			}
		}
</script>

<style>
	page {
		padding-bottom: 50rpx;
		background:rgba(248,249,251,1);
	}
	.noImg {
		width: 200rpx;
		height: 200rpx;
		margin: 370rpx 0 0 270rpx;
	}
	
	.list {
		margin-top: 3rpx;
		width: 750rpx;
		height: 186rpx;
		background: rgba(255, 255, 255, 1);
	}
	
	.img {
		position: absolute;
		top: 45rpx;
		left: 40rpx;
		width: 70rpx;
		height: 70rpx;
	}
	.name{
		width: 320rpx;
		letter-spacing: 3rpx;
		font-size: 30rpx;
		color: #333333;
		position: absolute;
		top: 60rpx;
		left: 140rpx;
	}
	.remark{
		float: right;
		margin: -120rpx 110rpx 0 0;
		font-size: 32rpx;
	}
	.amount {
		float: right;
		margin: -120rpx 50rpx 0 0;
		font-size: 32rpx;
		color: red;
		font-weight: bold;
	}
	
	.createAt {
		width: 320rpx;
		position: relative;
		top: 100rpx;
		left: 140rpx;
		font-size: 24rpx;
		color: #CCCCCC;
	}
	
	.userName {
		width: 320rpx;
		letter-spacing: 3rpx;
		font-size: 30rpx;
		color: #333333;
		position: absolute;
		top: 40rpx;
		left: 140rpx;
	}
	.noIncome {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #CCCCCC;
	}
</style>
