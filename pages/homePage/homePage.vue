<template>
	<view class="container">	
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<!-- #endif -->
		<view class="header"><label class="head-text">首页</label>
		<picker class="head-region" @change="bindPickerChange" :value="regionIndex" :range="region">
			<view class="uni-input" v-if="this.defaultRegion==''">{{region[regionIndex]}}</view>
			 <view class="uni-input" v-if="this.defaultRegion!=''">{{defaultRegion}}</view>
		</picker></view>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToDetailPage({title: '轮播广告'})">
					<image :src="item.savePath" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 分类 -->
		<view class="f-header m-t">
			<view class="tit-box">
				<text class="tit">精选商品</text>
			</view>
		</view>
		<view class="cate-section">
			<!-- 精选商品 -->
			<view class="seckill-section m-t">			
				<text class="yticon icon-you"></text>
				<scroll-view class="floor-list" scroll-x>
					<view class="scoll-wrapper">
						<view 
							v-for="(item, index) in goodsList" :key="index"
							class="floor-item"
							@click="navToDetailPage(item)">
							<image :src="item.commodityImg[0]" mode="aspectFill"></image>
							<text class="clamp">{{item.commodityTitle}}</text>
							<view class="PriceArea">
								<text class="priceOrigin">￥{{item.salePrice}}</text>
								<text class="priceCurrent">￥{{item.originalPrice}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 猜你喜欢 -->
		<view class="f-header m-t">
		
			<view class="tit-box">
				<text class="tit">猜你喜欢</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		
		<view class="guess-section">
			<view 
				v-for="(item, index) in goodsList" :key="index"
				class="guess-item"
				@click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.commodityImg[0]" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.commodityTitle}}</text>
				<text class="price">￥{{item.salePrice}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {api} from "./api.js"
	// 高德地图 api
	import amap from '../../libs/amap-wx.js';  
	
	export default {
		data() {
			return {
				amapPlugin: null,
				key: '8aa790ec80dd04abdf75736893a84613',
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				defaultRegion: '',
				region:['重庆市','上海市','山西'],
				regionIndex: 1,
				guessList:[],
				goodsList: [],
				addressName: ''
			};
		},
		
		methods: {
			//轮播图切换
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.commodityId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`,
				})				
			},	
			bindPickerChange(val) {
				uni.setStorageSync('location',this.region[val.detail.value]);
				this.defaultRegion = this.region[val.detail.value]
				this.getBanner(),
				this.getUserMes(),
				this.getRecommend(),
				this.getGuess()
			},
			/**
			 * 获取用户信息
			 */
			getUserMes(){
				let user = {
					// 此处默认传入重庆市
					// 用户信息和地区无关
					area:'重庆市'
				};
				api.getUserInfo().then(res =>{
					this.service = res.data.data,
				
					// userType 说明
					// 0: app
					// 1: 企业
					// 2: 小程序
					uni.setStorageSync('userType', this.service.userType),
					// 默认重庆（debug）
					uni.setStorageSync('location', "重庆"),
					// 存储角色信息
					uni.setStorageSync('roleName', this.service.roleName),
					// 当前用户是否为VIP
					uni.setStorageSync('isVip', this.service.isVip==0?false:true)
					// 当前地区是否有VIP业务
					uni.setStorageSync('haveVip', this.service.haveVip==0?false:true)
					
						
				}).catch(err => {
					console.log(err)
				});		
			},
			
			/**
			 * 获取轮播图信息
			 */
			getBanner() {				
				let location = {
					locationCode:'WCPHomePage'
				};
				api.getBannerImgs(location).then(res =>{
					this.carouselList = res.data.data,
					this.swiperLength = this.carouselList.length;
					this.carouselList = this.carouselList;
				}).catch(err => {
					console.log(err)
				})		
			},
			
			/**
			 * 获取精选商品
			 */
			getRecommend() {
				let userAndLocalMes = {
					// area: uni.getStorageSync('location'),
					area: this.addressName,
					longitude: '',
					latitude: '',
					shopPlace: 'Recommend'
				};
				api.getProducts(userAndLocalMes).then(res =>{
					this.goodsList = res.data.data,
					console.log(this.goodsList)		
				}).catch(err => {
					console.log(err)
				})	
			},
			
			/**
			 * 猜你喜欢
			 */
			getGuess() {
				let userAndLocalMes_1 = {
					// area: uni.getStorageSync('location'),
					area: this.addressName,
					longitude: '',
					latitude: '',
					shopPlace: 'Guess'
				};
				api.getProducts(userAndLocalMes_1).then(res =>{
					this.guessList = res.data.data,
					console.log(this.guessList)		
				}).catch(err => {
					console.log(err)
				})			
			}
														
		},
							
		/**
		 * 猜你喜欢列表
		 */
		mounted() {		
			/**
			 * 获取设备定位
			 */
			console.info('mounted')
			console.info(!uni.getStorageSync('location'))
			if(!uni.getStorageSync('location')){
				this.amapPlugin = new amap.AMapWX({
					    key: this.key  
					});  
					
					uni.showLoading({  
						title: '获取信息中'  
					});  
					this.amapPlugin.getPoiAround({  
						success: (data) => {  
							uni.hideLoading();  
							this.addressName = data.poisData[0].cityname;  
							uni.setStorageSync('location', this.addressName)
							this.defaultRegion = uni.getStorageSync('location')||'';
						},
						fail: (res) => {
							console.log(res)  
						}
					}); 
				}	
					this.defaultRegion = uni.getStorageSync('location')||'';
					this.getBanner(),
					this.getUserMes(),
					this.getRecommend(),
					this.getGuess()
			
		}
		// #ifndef MP

		// #endif
	}
</script>

<style lang="scss">
	.header{
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		margin: 0 auto;
	}
	.head-text {
		float: left;
	}
	.head-region{
		float: right;
	}
	
	/* #ifdef MP */
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:$font-color-base;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-50upx;
		}
		.carousel-section{
			margin: 0 auto;
			width: 90%;
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #ffffff;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			// height: 400upx;
			transition: .4s;
		}
	}
	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 秒杀专区 */
	.seckill-section{
		padding: 4upx 30upx 24upx;
		background: #fff;
		.s-header{
			display:flex;
			align-items:center;
			height: 92upx;
			line-height: 1;
			.s-img{
				width: 140upx;
				height: 30upx;
			}
			.tip{
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}
			.timer{
				display:inline-block;
				width: 40upx;
				height: 36upx;
				text-align:center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0,0,0,.8);
			}
			.icon-you{
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}
		.floor-list{
			white-space: nowrap;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			display:flex;
			flex-direction: column;
			align-items: center;
			width: 240rpx;
			margin-right: 50upx;
			font-size: 32rpx;
			font-weight: 800;
			color: $font-color-dark;
			font-family:PingFang SC;
			line-height: 1.8;
			image{
				width: 240rpx;
				height: 240rpx;
				border-radius: 6upx;
			}
			.PriceArea{
				display:flex;
				justify-content: center;
				align-items: center;
			}
			.clamp{
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp:2;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
			}
			.priceOrigin{
				font-size: 32rpx;
				font-family:PingFang SC;
				font-weight: 500;
				color:rgba(255,126,48,1);
			}
			.priceCurrent{
				margin-left: 10rpx;
				font-size: 28rpx;
				font-family:PingFang SC;
				font-weight: 500;
				color:rgba(153,153,153,1);
				text-decoration: line-through;
			}
		}
	}
	
	.f-header{
		// display:flex;
		
		align-items:center;
		height: 90upx;
		padding: 20upx 30upx 8upx;
		background: #fff;
		image{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit{
			font-size:32rpx;
			font-family:PingFang SC;
			font-weight:bold;
			color:rgba(51,51,51,1);
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
		.icon-you{
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}

	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
	

</style>
