<template>
	<view>
		<view class="list" v-for="(item, index) in addressList" :key="index">
			<view class="wrapper">
				<view class="address-box">
					
					<text class="receiver">{{item.receiver}}</text>
					<text class="mobile">{{item.contactNumber}}</text>
				</view>
				<view class="u-box">
					<text v-if="item.isDefault==1" class="tag">默认</text>
					<text class="address">{{item.province}} {{item.city}} {{item.area}} {{item.detail}}</text>
				</view>
			</view>
			<text class="edit" @click="addAddress('edit', item)">编辑</text>
		</view>
		
		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {api} from	'./api.js'
	export default {
		data() {
			return {
				addressList: [
					{
						addressId:'',
						receiver: '',
						contactNumber: '',
						province: '',
						city:'',
						area:'',
						detail: '',
						isDefault: 0,
					}
				]
			}
		},
		onShow() {
			console.log("8888888");
			this.getData();					
		},
		methods: {
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/newAddress?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			getData(){
				api.getData().then(res=>{
					console.log(res.data.data);
					this.addressList=res.data.data;
				}).catch(err=>{
					console.log(err)
				})
			},
			reLoad(){
				this.getData();
			}
		}
	}
</script>

<style>
page{
		padding-bottom: 50rpx;
		background: #F8F9FB;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 50rpx 50rpx 50rpx 50rpx;
		position: relative;
		margin-top: 3rpx;
		border-color: #CCCCCC;
		background: #FFFFFF;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
	}
	.name{
		margin-right: 30rpx;
		font-size: 40rpx;
	}
	.mobile{
		margin-left: 20rpx;
		font-size: 40rpx;
		color: #C0C0C0;
	}
	.u-box{
		font-size: 28rpx;
		margin-top: 16rpx;
	}
	.tag{
		font-size: 26rpx;
		color: #06C1AE;
		margin-right: 10rpx;
		background: #e6f9f7;
		border-radius: 24rpx;
		padding: 10rpx 12rpx;
		line-height: 1;
	}
	.address{
		font-size: 32rpx;
		line-height: 20rpx;
	}
	.edit{
		display: flex;
		align-items: center;
		height: 80rpx;
		font-size: 32rpx;
		color: #CCCCCC;
		padding-left: 30rpx;
	}
	
	.add-btn{
		position: fixed;
		left: 24rpx;
		right: 30rpx;
		bottom: 30rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		background-color: #06C1AE;
		border-radius: 40rpx;	
	}
	
</style>
