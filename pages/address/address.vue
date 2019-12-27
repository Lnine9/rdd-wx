<template>
	<view>
		<view v-show="showtype">
			<noPic :picSrc="picSrc" :noText="noText"></noPic>
		</view>
		<view  class="list" v-for="(item, index) in addressList" :key="index" v-show="!showtype">
			<view  @click="choose(index)" class="wrapper">
				<view class="address-box">					
					<text class="receiver">{{item.receiver}}</text>
					<text class="mobile">{{item.contactNumber}}</text>
				</view>
				<view class="u-box">
					<!-- <text v-if="item.isDefault==1" class="tag">默认</text> -->
					<text class="address">{{item.province}} {{item.city}} {{item.area}} {{item.detail}}</text>
				</view>
			</view>	
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
			<text class="edit" @click="addAddress('edit', item)">编辑</text>
			<switch @tap="notice(index)" style="margin-top: 20rpx;transform: scale(0.7);margin-left: 20rpx;" v-bind:checked="item.isDefault == 1?true:false" color="#4CD964"  v-bind:disabled="defaultIndex == index && item.isDefault == 1"  />
				</view>
		</view>	
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	import {api} from	'./api.js'
	import noPic from '../components/noPic/noPic.vue'
	export default {
		components: {
			noPic
		},
		data() {
			return {
				picSrc: "../../../static/noAdress.png",
				noText: "暂无收货地址",
				showtype:true,
				isChoose:false,
				defaultIndex:0,
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
		onLoad: function(params) {
			if (params.choose){
			this.isChoose = params.choose;
			}
		},
		onShow() {
			
			this.getData();
			uni.setTabBarItem({
				index: 3,
				text: '订单',
			})
		},
		
		computed:{
			isDefault:function(isDefault) {
				console.log(isDefault)
				if (isDefault == 0){
					return true
				}
				else{
					return false
				}
			}
		},
		methods: {
			
			notice(index){
				
				if (index == this.defaultIndex && this.addressList[index].isDefault == 1){
							uni.showToast({
								title:"必须有一个默认地址",
								icon:"none",	
							})
							
							
						}else{
							if(this.addressList[index].isDefault == 0){
								this.addressList[index].isDefault = 1
								api.setDefaultAddress(this.addressList[index]).then(res=>{
										if (res.data.data != true){
											this.addressList[index].isDefault = 0
											this.addressList[this.defaultIndex].isDefault = 0
										}
										else{
											this.addressList[this.defaultIndex].isDefault = 0
											this.defaultIndex = index
										}
									}).catch(err=>{
										console.log(err)
										this.addressList[index].isDefault = 0
									})
								}
						}
					},
			
			// 使用地址
			choose(index){
				if (this.isChoose){
					uni.setStorageSync('chooseAddress', this.addressList[index])
					uni.navigateBack({
						
					})
				}
			},
			
			// //提交修改默认
			// 	setDefault(index){
			// 		if(this.addressData.isDefault===1){
			// 			api.setDefaultAddress(this.addressData).then(res=>{
			// 			console.log(res)
			// 		}).catch(err=>{
			// 			console.log(err)
			// 		})
			// 	}
			// },
			// 更改默认地址项
			switchChange(index) {
				
				},
			//跳转页面
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/newAddress?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//获取地址
			getData(){
				api.getData().then(res=>{
					console.log(res.data.data);
					this.addressList=res.data.data;
					if(res.data.data.length==0){
						this.showtype=true;
						this.addressList.forEach((item,index) =>{
							if (item.isDefault == 1){
								this.defaultIndex = index
							}
						})
					}
					else{
						this.showtype=false;
					}
				}).catch(err=>{
					console.log(err)
				})
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
	/* .switch-address {
		height: 80rpx;
		width: 150rpx;
		color: #42B983;
	} */
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
	.receiver{
		color: #333333;
		margin-left: 5rpx;
		font-size: 30rpx;
	}
	.mobile{
		margin-left: 20rpx;
		font-size: 30rpx;
		color: #999999;
	}
	.u-box{
		font-size: 28rpx;
		margin-top: 16rpx;
	}
	.tag{
		font-size: 20rpx;
		color: #06C1AE;
		margin-right: 10rpx;
		background: #e6f9f7;
		border-radius: 20rpx;
		padding: 10rpx 16rpx 10rpx 16rpx;
	}
	.address{
		color: #333333;
		font-size: 24rpx;
		line-height: 60rpx;
	}
	.edit{
		display: flex;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: #CCCCCC;
		padding-left: 30rpx;
		border-left: 1rpx solid #F3F3F3;
		
	}
	
	.add-btn{
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

	.warning{
		display: flex;
		align-items: center;
		justify-content: center;
		color: #CCCCCC;
	}
	</style>
