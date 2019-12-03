<template>

	<view v-bind:style="noDataCenter" v-if="showPage" class="container">
		<view v-if="!showPage" class="nodataText">


		<image src="../../static/myOrder/myOrderNoData.png" class="noDataPic"></image>
		<text class="nodataText" >暂无数据</text>

		</view>
		<view  class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item"  v-for="(item,index) in titleImg" :key="index">
					<view @click="checkPicture(titleImg ,index)" class="image-wrapper">
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
				<text class="price">{{"￥" + dataDic.salePrice}}</text>
				<text class="m-price">{{"￥" + dataDic.originalPrice}}</text>
				</view>
				<view style="color: #999999;">
				<text style="margin-right: 40rpx;">销量: {{dataDic.salesVolume}}</text>
				<text style="display: inline-block;">库存: {{dataDic.commodityNum}}</text>
				</view>
			</view>

		</view>
		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list">
					<view style="display: flex;align-items: center;">
					<image style="width: 24rpx;height: 28rpx;margin-right: 10rpx;" src="../../static/product/location.png"></image>
					<text style="font-size:28rpx;font-weight:500;color:rgba(51,51,51,1);">{{dataDic.shopName}}</text>
					</view>
					<text style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(204,204,204,1);margin-left: 34rpx;">{{dataDic.shopAddress}}</text>
				</view>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list"  style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(153,153,153,1);padding-left: 30rpx;
padding-right: 30rpx;
">
					<template>{{dataDic.commodityInfo}}</template>
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
			<image style="width: 31rpx;height: 30rpx;margin-right: 10rpx;" src="../../static/product/server.png"></image>
			<text style="color:rgba(51,51,51,1);">联系客服</text>
			</view>
			<view @click="reayToBuy()" class="buyView">
			<text >立即购买</text>
			</view>
		</view>
		<!-- 选择购买数量 -->

					<view v-show="isBuy" class="buyBox"></view>
					<view  v-show="isBuy" class="cart-item" >
						<view class="image-wrapper">
							<image :src="titleImg[0]"
								style="width: 200rpx;height: 200rpx;"

							></image>
						</view>
						<view class="item-right">
							<view style="display: flex;justify-content: space-between;align-items: center;">
							<text class=" title" style="font-weight: 500;">{{dataDic.commodityTitle}}</text>
							<text class="del-btn" @click="cancel">取消</text>
							</view>
							<text class="price">¥{{buyNum * dataDic.salePrice}}</text>
							<view style="display: flex;justify-content: space-between;margin-top: 40rpx;align-items: center;">
							<uniNumberBox
								:min="1"
								:max= "dataDic.commodityNum"
								:value="buyNum>dataDic.commodityNum?dataDic.commodityNum:buyNum"
								@change="numberChange()"
							></uniNumberBox>
							<button class="buyButton" @click="buy()">立即购买</button>
							</view>
						</view>


					</view>

	</view>
</template>

<script>
	import uniNumberBox from '../components/uni-number-box/uni-number-box.vue'
	import {api} from "./api.js"
	export default{
		components:{uniNumberBox},
		data() {
			return {
				showPage:false,
				buyNum:1,
				isBuy:false,
				dataDic:{},
				commodityImg: [],
				specClass: 'none',
				titleImg:[],
				shareList: [],
				bottomImg: [],
				imgList: [],

			};
		},
		computed: {
			noDataCenter() {
				if (!this.showPage) {
					return "text-align:center"
				}
				else{
					return ""
				}

			}
		},

		methods:{
			/**
			 * 获取商品详细信息
			 * @param {Object} commodityId
			 */
			numberChange(data){

				this.buyNum = data;

			},
			cancel(){
				this.isBuy = false
			},

			getData(commodityId) {
				uni.showLoading({
					title:"正在加载"
				})
				api.getList({commodityId:commodityId}).then(res =>{

					this.dataDic = res.data.data,
					this.dataDic.commodityNum = Number.parseInt(this.dataDic.commodityNum)
					this.dataDic.salePrice = Number.parseFloat(this.dataDic.salePrice)


					this.titleImg = this.dataDic.commodityImg.filter((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
						return index < 3
					})
					let bottomPicture = this.dataDic.commodityImg.filter((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
						return index >= 3
					})
					this.bottomImg = `<div style="width:100%">`
					this.dataDic.commodityImg.forEach((item, index, arr) => { // item为arr的元素，index为下标，arr原数组
						if(index >= 3){
							this.bottomImg += `<img style="width:100%;display:block;" src="${item}"/>`
						}
					});
					this.bottomImg += `</div>`

					this.commodityImg=this.dataDic.commodityImg
					uni.hideLoading()
					this.showPage = true
				}).catch(err => {

					uni.hideLoading()
					uni.showToast({
						title:"网络错误，请稍后重试"
					})
				})
			},
			// 放大查看图片
			checkPicture:function(url,index){
				 uni.previewImage({
							current:index,
				            urls: url,
							indicator:"default",
							loop:true,

				            // longPressActions: {
				            //     itemList: ['发送给朋友', '保存图片', '收藏'],
				            //     success: function(data) {
				            //         console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				            //     },
				            //     fail: function(err) {
				            //         console.log(err.errMsg);
				            //     }
				            // }
				        });
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

			reayToBuy(){

				this.isBuy = true
			},

			buy(){


				uni.navigateTo({
					url: `/pages/payOrder/payOrder?commodityId=${this.dataDic.commodityId}&commodityNum=${this.buyNum}&remark = ${this.dataDic.remark}&addressId=${this.dataDic.addressId}`
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
		height: 400upx;
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
			font-size: 26rpx;
			font-weight: 400;
			color:$uni-color-primary;
		}
		.price{
			font-size: 32rpx;
			font-weight: 800;
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
		border-width: 1rpx 0 1rpx 0;
		border-style: solid;
		border-color: rgba(243, 243, 243, 0.7);
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

	.cart-item{
		background-color:#FFFFFF;
		width: 100vw;
		z-index: 4;
		display:flex;
		position:fixed;
		bottom: 0rpx;
		padding-top:  30rpx;
		padding-left: 20rpx;

		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;

			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				font-size:28rpx;

				font-weight:500;
				color:rgba(255,126,48,1);
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			position: relative;
			width: 100rpx;
			right: 20rpx;
			font-size:28rpx;

			color: $font-color-light;
		}
	}

	.noDataPic {
		width: 200rpx;
		height: 200rpx;
		padding-top: 20vh;
	}

	.nodataText{
		font-size: 24rpx;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #CCCCCC;
	}

	.buyButton{
		background-color: #FFFFFF;
		color: rgba(6,193,174,1);
		font-size: 24rpx;
		height: 63rpx;
		width: 180rpx;
		border: 1rpx solid rgba(6,193,174,1);

		margin-left: 100rpx;
	}

	.buyBox{
		background-color: rgba(0,0,0,0.5);
		 z-index: 3;
		position: fixed;
		bottom: 0rpx;
		right: 0rpx;
		width: 100vw;
		height: 100vh;
		box-shadow:0px -6px 10px 0px rgba(116,116,116,0.06)
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
