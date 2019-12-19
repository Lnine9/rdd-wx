<template>
	<view style="padding-bottom: 100upx;" class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->

		<!-- #endif -->
		<view class="header"><label class="head-text">首页</label>
			<picker class="head-region" @change="bindPickerChange" :value="regionIndex" :range="areas">
				<view class="uni-input" v-if="this.defaultRegion!=''">{{defaultRegion}}</view>
				<view class="uni-input" v-if="this.defaultRegion==''">{{areas[regionIndex]}}</view>
				<image src="/static/homepage/drop_down.png" class="drop-down"></image>
			</picker>
		</view>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper 
				class="carousel" 
				circular=true 
				autoplay
				indicator-dots
				indicator-color="rgba(255,255,255,0.3))" 
				indicator-active-color="rgba(255,255,255,1)"
				@change="swiperChange" 
				@current="swiperCurrent">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToWebView(item)">
					<image :src="item.savePath" />
				</swiper-item>
			</swiper>
		<!-- 	<view class="dots">
			    <block v-for="(item, index) in carouselList.length" :key="item">
				    <view class="dot" :class="index==swiperCurrent ? ' active' : ''"></view>
			 </block>
		  </view> -->
		</view>

		<!-- 精选商品 -->
		<view class="f-header m-t">
			<view class="tit-box title-adapt">
				<text class="tit">精选商品</text>
			</view>
		</view>
		<view class="cate-section">
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
								<text class="priceOrigin">￥</text>
								<text class="priceOriginValue">{{item.salePrice}}</text>
								<text class="priceCurrent">￥{{item.originalPrice}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 猜你喜欢 -->
		<view class="f-header m-t r-m-t">
			<view class="tit-box">
				<text class="tit">猜你喜欢</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		<view class="guess-section r-m-t">
			<!-- <view
				v-for="(item, index) in guessList" :key="index"
				class="guess-item"
				@click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.commodityImg[0]" mode="aspectFill"></image>
				</view>
				<text class="clamp">{{item.commodityTitle}}</text>
				<view class="PriceArea">
					<text class="priceOrigin">￥{{item.salePrice}}</text>
					<text class="priceCurrent">￥{{item.originalPrice}}</text>
				</view>
			</view> -->
			
			<waterfall-flow class="guess-content" :list="list" :loading="loading" @click="choose"></waterfall-flow>
		</view>
		<tabBar :currentPage="currentPage"></tabBar>
	</view>
</template>

<script>
	import {api} from "./api.js"
	// 高德地图 api
	import amap from '../../libs/amap-wx.js';
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	// 商品展示瀑布流
	import WaterfallFlow from './waterfall-flow/nairenk-waterfall-flow.vue'
	export default {
		data() {
			return {
				current: 0,
				swiperCurrent: 0,
				currentPage:'homePage',
				areas: [],
				amapPlugin: null,
				key: '4226617a8bb2e82f8a0a6e42958a5d43',
				titleNViewBackground: '',
				swiperLength: 0,
				carouselList: [],
				defaultRegion: '',
				regionIndex: 1,
				guessList:[],
				goodsList: [],
				addressName: '',
				
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true
			};
		},
		components:{
			tabBar,
			WaterfallFlow
		},
		onShow(){
			this.wxGetLogin();
			
			// 获取瀑布流数据
			// this.getList();
		},
		// 向下滑动刷新，暂时禁用
		// onReachBottom() {
		// 	this.page++;
		// 	this.loading = true;
		// 	this.getList();
		// },
		methods: {
			// 选中
			choose(item) {
				//测试数据没有写id，用title代替
				let id = item.commodityId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`,
				})
			},
			// 模拟加载数据
			getList() {
				if (this.list.length < this.guessList.length) {
					setTimeout(() => {
						this.end = this.page * 10;
						this.list = this.list.concat(this.guessList.slice(this.start, this.end));
						this.start = this.end;
						// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
						setTimeout(() => {
							this.loading = false;
						}, 120);
					}, 1000)
				} else {
					this.loading = false;
				}
			},
			
			//轮播图切换
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			
			changeSwiper(e) {
			    this.swiperCurrent = e.detail.current;
			},
			/**
			 * web页面跳转
			 * 0. 后台公告页面跳转
			 * 1. 无跳转
			 * 2. 小程序页面跳转
			 * @param {Object} item
			 */
			navToWebView(item) {
				if(item.announcementType == '0') {
					// 公告页面跳转
					let resulturl = item.announcementContent
					getApp().globalData.desc = resulturl
					uni.navigateTo({
						url: `/pages/webView/webView`
					})
				}
				else if (item.announcementType == '1') {
					// 无跳转
					return
				}
				else {
					// 本地页面跳转
					let resulturl = item.announcementContent
					uni.navigateTo({
						url: `${resulturl}`
					})
				}
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
				this.addressName=this.areas[val.detail.value]
				uni.setStorageSync('location',this.areas[val.detail.value]);
				this.defaultRegion = this.areas[val.detail.value]
				this.getBanner(),
				// this.getUserMes(),
				this.getRecommend(),
				this.getGuess(),
				this.getAreas()
			},
			//判断是否登录
			wxGetLogin(){
				let _this = this
				uni.checkSession({
					  success: function () {
						  _this.getUserMes();
						  if(uni.getStorageSync('token')){
							  uni.setStorageSync('loginState',true);
						  }else{
							  uni.setStorageSync('loginState',false);
						  }
						  
						  console.log(uni.getStorageSync('loginState'))
					  },
					  fail: function () {
						uni.setStorageSync('loginState',false);
						console.log(uni.getStorageSync('loginState'))
					  }
					})
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
				api.getUserInfo(user).then(res =>{
					this.service = res.data.data,
					console.log(this.service)
					// userType 说明
					// 0: app
					// 1: 企业
					// 2: 小程序
					uni.setStorageSync('userId', this.service.userId),
					console.log(this.service.userId)
					uni.setStorageSync('userType', this.service.userType),
					//缓存电话
					uni.setStorageSync('bindingAccount',this.service.bindingAccount)
					console.log(this.service.bindingAccount)
					// 默认重庆（debug）
					uni.setStorageSync('location', "重庆市"),
					//储存绑定信息
					uni.setStorageSync('bindingId',this.service.bindingid),
					// 存储角色信息
					uni.setStorageSync('roleNameList', this.service.roleNameList),
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
				}).catch(err => {
					console.log(err)
				})
			},

			/**
			 * 获取地区列表信息
			 */
			getAreas() {
				api.getAreas().then(res =>{
					var array = res.data.data
					this.areas = array.split(",")
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
					this.goodsList = res.data.data
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
					shopPlace: 'Guess'
				};
				api.getProducts(userAndLocalMes_1).then(res =>{
					this.guessList = res.data.data
					uni.stopPullDownRefresh();
					
					this.getList();
				}).catch(err => {
					uni.stopPullDownRefresh();
					console.log(err)
				})
			}

		},

		onPullDownRefresh() {
			this.getBanner(),
			// this.wxGetLogin(),
			// this.getUserMes(),
			this.getRecommend(),
			this.getGuess(),
			this.getAreas()
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
							uni.hideLoading();
							console.log(res)
						}
					});
				}
				this.defaultRegion = uni.getStorageSync('location')||'';
				this.getBanner(),
				// this.wxGetLogin(),
				// this.getUserMes(),
				this.getRecommend(),
				this.getGuess(),
				this.getAreas()
		}
		// #ifndef MP

		// #endif
	}
</script>

<style lang="scss">
	
	.container {
		height: 100%;
		background: #F8F9FB;
	}
	
	.header{
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		margin: 0 auto;
		background: #F8F9FB;
	}
	.head-text {
		float: left;
		font-size: 40rpx;
		font-weight: bold;
		color: #333333;
	}
	.head-region{
		float: right;
		font-size: 28rpx;
	}
	.drop-down{
		width: 7px;
		height: 7px;
		top: 12rpx;	
		margin-left: -30rpx;
	}
	.r-m-t {
		margin-top: -15rpx;
	}
	
	// 精选商品微调
	.title-adapt {
		// padding-top: 10rpx;
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
			background: #F8F9FB;
			position:relative;
			z-index:5;
			border-radius:25upx 25upx 0 0;
			// margin-top:-45upx;
		}
		.carousel-section{
			background: #F8F9FB;
			margin: 0 auto;
			width: 90%;
			
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				height: 280rpx;
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


	// page {
	// 	background: #ffffff;
	// }
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
			border-radius: 20upx;
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
		padding: 0 30upx;
		margin-top: 30rpx;
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
				border-radius: 20px;
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
			padding-left: 2rpx;
			padding-right: 2rpx;
		}
		.floor-item{
			display:flex;
			flex-direction: column;
			width: 280rpx;
			background: #FFFFFF;
			padding-bottom: 20rpx;
			margin-right: 30rpx;
			font-size: 32rpx;
			font-weight: 800;
			color: $font-color-dark;
			border-bottom-right-radius: 10rpx;
			border-bottom-left-radius: 10rpx;
			image{
				width: 280rpx;
				height: 280rpx;
				border-top-right-radius: 10rpx;
				border-top-left-radius: 10rpx;
				// border-radius: 20upx;
				// border: 2upx solid #E3E3E3
			}
			.PriceArea {
				/* margin-left: 10rpx; */
			}

			.priceOrigin {
				font-size: 24rpx;
				font-weight: 700;
				color: rgba(255, 126, 48, 1);
			}
			
			.priceOriginValue {
				font-size: 31rpx;
				font-weight: 700;
				color: rgba(255, 126, 48, 1);
			}
			.clamp{
				width: 280rpx;
				// margin-left: 15rpx;
				padding-left: 15rpx;
				-webkit-box-orient: vertical;
				-webkit-line-clamp:2;
				word-break: break-all;
				margin-top: 10rpx;
				font-size: 32rpx;
				font-weight: 500;
				color:rgba(51,51,51,1);
				max-width: 280rpx;
				white-space: nowrap;
				text-overflow:ellipsis;
				overflow:hidden;
			}
		}
	}
	.uni-input {
		font-weight: 500;
		margin-right: 37rpx;
		display: inline-block;
	}
	.PriceArea{
		margin-left: 15rpx;
	}

	.clamp{
		margin-bottom: 5rpx;
		width: 280rpx;
		// margin-left: 15rpx;
		padding-left: 15rpx;
		-webkit-box-orient: vertical;
		-webkit-line-clamp:2;
		word-break: break-all;
		margin-top: 16rpx;
		font-size: 27rpx;
		font-weight: 500;
		color:rgba(51,51,51,1);
		max-width: 280rpx;
		white-space: nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
	}

	.priceOrigin{
		font-size: 27rpx;
		font-weight: 700;
		color:rgba(255,126,48,1);
	}

	.priceCurrent{
		margin-left: 17rpx;
		font-size: 24rpx;
		font-weight: 500;
		color:rgba(153,153,153,1);
		text-decoration: line-through;
	}

	.f-header{
		background: #F8F9FB;
		width: 90%;
		margin: 25rpx auto;
		align-items:center;
		// height: 80upx;
		// padding: 20upx 30upx 8upx;
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
			font-weight: 700;
			color:#333;
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
		display: flex;
		justify-content: center;
		flex-wrap:wrap;
		margin: 0rpx auto;
		background-color: #F8F9FB;
		width: 90%;
		.guess-content {
			width: 100%;
			margin-bottom: 10rpx;
		}
		
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
			border-radius: 10px;
			overflow: hidden;
			// border-color: #E3E3E3;
			// border-width: 1px;
			border: 2upx solid #E3E3E3;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
				// border: 2upx solid #E3E3E3
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
	
	 .dots {
	          position: absolute;
	          bottom: 20rpx;
	          left: 50%;
	          // 这里一定要注意兼容不然很可能踩坑          
	          transform: translate(-50%, 0);
	          -webkit-transform: translate(-50%, 0);        
	          z-index: 99;
	          display: flex;
	          flex-direction: row;
	          justify-content: center;
	
	          .dot {
	              // width: 24rpx;
				  width: 8rpx;
	              height: 8rpx;
	              transition: all .6s;
	              background: rgba(0, 0, 0, .3);
	              margin-right: 10rpx;
	          }
	
	          .active {
	              width: 8rpx;
	              height: 8rpx;
	              background: rgba(255, 255, 255, .8);
	          }
	      }

	
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
</style>
