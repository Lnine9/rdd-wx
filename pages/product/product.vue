<template>
	<view  class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in titleImg" :key="index">
					<view class="image-wrapper">
						<image
							:src="item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{dataDic.commodityTitle}}</text>
			<view class="price-box">
				<view style="display: block;">
				<text class="price">{{dataDic.originalPrice}}</text>
				<text class="m-price">{{"￥" + dataDic.salePrice}}</text>
				</view>
				<view style="color: #999999;">
				<text style="margin-right: 20rpx;">销量: {{dataDic.salesVolume}}</text>
				<text style="display: inline-block;">库存: {{dataDic.commodityNum}}</text>
				</view>
			</view>

		</view>
		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list">
					<view style="display: inline-block;">
					<image style="width: 24rpx;height: 28rpx;margin-right: 10rpx;" src="../../static/product/ic-定位@2x.png"></image>
					<text style="font-size:28rpx;font-family:PingFang SC;font-weight:500;color:rgba(51,51,51,1);">{{dataDic.shopName}}</text>
					</view>
					<text style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(204,204,204,1);">{{dataDic.shopAddress}}</text>
				</view>
			</view>
		</view>
		
		<view class="c-list">		
			<view class="c-row b-b">
				<view class="con-list"  style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(153,153,153,1);">
					<template>{{dataDic.shopContent}}</template>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>商品介绍</text>
			</view>
			<rich-text :nodes="bottomImg"></rich-text>
		</view>
		<view class="bottom">
			<view @click="makeCall()" class="buyView" style="background-color: #FFFFFF;">
			<image style="width: 31rpx;height: 30rpx;margin-right: 10rpx;" src="../../static/product/ic-客服@2x.png"></image>
			<text style="color:rgba(51,51,51,1);">联系客服</text>
			</view>
			<view @click="buy()" class="buyView">
			<text >立即购买</text>
			</view>
		</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {api} from "./api.js"
	export default{
		data() {
			return {
				dataDic:{},
				commodityImg: [],
				specClass: 'none',
				titleImg:[],		
				shareList: [],
				bottomImg: [],
				imgList: [],
				
			};
		},
		
		methods:{
			/**
			 * 获取商品详细信息
			 * @param {Object} commodityId
			 */
			getData(commodityId) {
			
				api.getList({commodityId:commodityId}).then(res =>{
					console.log(res.data.data)
					this.dataDic = res.data.data,
					console.log(this.dataDic)
					this.titleImg = this.dataDic.commodityImg.filter((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
						return index < 3
					})
					this.bottomImg = `<div style="width:100%">`
					this.dataDic.commodityImg.forEach((item, index, arr) => { // item为arr的元素，index为下标，arr原数组
						if(index >= 3){
							this.bottomImg += `<img style="width:100%;display:block;" src="${item}" />`
						}
					});
					this.bottomImg += `</div>`
					console.log(this.bottomImg)
					this.commodityImg=this.dataDic.commodityImg
				}).catch(err => {
					console.log(err)
				})		
			},
			
			makeCall(){
				uni.makePhoneCall({
				 	
				 	// 手机号
				    phoneNumber: this.dataDic.shopPhone, 
				
					// 成功回调
					success: (res) => {
						console.log('调用成功!')	
					},
				
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
					
				  });
			},
			
			buy(){
				console.log("购买")
				uni.navigateTo({
					url: `/pages/payOrder/payOrder?commodityId=${this.dataDic.commodityId}&commodityNum=
					${this.dataDic.commodityNum}&remark = ${this.dataDic.remark}&addressId=${this.dataDic.addressId}` 
				})
			},
		},
		onLoad: function(params) {
			console.log(params);
			let Id = params.id;
			this.getData(Id);
		},
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 98rpx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32rpx;
			font-family:PingFang SC;
			font-weight:bold;
			color:rgba(48,48,56,1);
			color: $font-color-dark;
			padding: 10rpx;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			justify-content: space-between;
			align-items:baseline;
			height: 64upx;
			padding: 10rpx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
			color: #FF7E30;
		}
		.m-price{
			margin:0 12upx;
			color: #999999;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}

	.c-list{
		border-width: 1px 0 1px 0;
		border-style: solid;
		border-color: rgba(243, 243, 243, 1);
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	.buyView{
		display: inline-block;
		background-color: #06C1AE;
		height: 98rpx;
		width: 50vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.bottom{
		z-index: 2;
		box-shadow:0px -6px 10px 0px rgba(116,116,116,0.06);
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		display: flex;
		font-size:28rpx;
		font-family:PingFang SC;
		font-weight:400;
		color:#FFFFFF;
		background-color: #06C1AE;
	}
	
	
	
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	
	
	
	
</style>
