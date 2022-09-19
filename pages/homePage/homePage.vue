<template>
	<view class="container">
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->

		<!-- #endif -->

		<!-- 导航栏与状态栏占位与内容填充 -->
		<view class="nav-box" :style='"height:" + (status + navHeight) + "px;" + navColor'>
			<!-- 手机状态栏占位符 -->
			<view class="width-max" :style='"height:" + status + "px;"'></view>

			<!-- 标题栏 -->
			<view class="width-max nav-title-txt" :style='"line-height:" + navHeight + "px;height:" + navHeight + "px;"'>
				囧途宝盒
			</view>

			<!-- 地区选择与搜索框 -->
			<view class="nav-content-box" :style='"height:" + navHeight + "px;" + navColor'>
				<picker class="picker-region" @change="bindPickerChange" :value="regionIndex" :range="areas">
					<text class="area-picker-txt">{{defaultRegion}}</text>
					<image src="/static/homepage/drop_down.png" class="drop-down"></image>
				</picker>

				<!-- 搜索框(TODO) -->
				<view class="search-box" :style='"height:" + (navHeight - 15) + "px;"'>
					<icon class="search-icon" size='15' type='search'></icon>
					<input class="search" disabled placeholder-class="search-placeholder-txt" placeholder="搜你所想" type="text"  value="" @click="getToSearch()" />
				</view>
			</view>
		</view>

		<!-- 顶部轮播图 -->
		<view class="carousel-section">
			<!-- 背景色区域 -->
			<swiper class="carousel" :style='"height:" + ((2 * navHeight + status) * 6 / 3) + "px;"' circular=true autoplay
			 indicator-dots indicator-color="rgba(255,255,255,0.3))" indicator-active-color="rgba(255,255,255,1)" @change="swiperChange"
			 @current="swiperCurrent">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToWebView(item)">
					<image :src="item.savePath" />
				</swiper-item>
				<swiper-item style="display: flex;align-items: center;background: rgb(183, 183, 183);">
					<ad unit-id="adunit-06cb62ad22815b23"></ad>
				</swiper-item>
			</swiper>
		</view>

		<!-- 首页主内容 -->
		<view class="main-content-box">
			<!-- 占位view，占用原先的圆角处 -->
			<view class="width-max main-content-placeholder"></view>

			<!-- 类别 -->
			<view class="category-box">
				<view v-for="(item, index) of routerList" :key="index" class="category-content" :data-index="index" @tap="navToRoute">
					<!-- <view class="category-content-img-box">
						<image class="category-content-img" :src="item.savePath" mode=""></image>
					</view> -->

					<image class="category-content-img-box" :src="item.savePath" mode="scaleToFill"></image>
					<view class="category-content-txt">
						<text>{{item.menuName}}</text>
					</view>
				</view>
			</view>

			<!-- 特别推荐类别 -->
			<view class="section-title-txt">
				<text>{{specialRouter.menuName === undefined? '' : specialRouter.menuName}}</text>
			</view>

			<view class="special-rec-section">
				<image class="special-rec-section-img" :src="specialRouter.savePath" mode="scaleToFill" data-index="specical" @tap="navToRoute"></image>
			</view>

			<view class="section-title-txt">
				<text>猜你喜欢</text>
			</view>

			<view class="guess-section" v-if="!showNoGuess">
				<waterfall-flow class="guess-content" :list="list" :loading="loading" @click="choose"></waterfall-flow>
			</view>

			<!-- 暂无猜你喜欢的情况 -->
			<view class="no-commodity-container" style="padding-bottom: 110rpx;" v-else>
				<view class="no-commodity-content">
					<image src="/static/homepage/no-commodity-img.png" mode="aspectFill" class="no-commodity-img"></image>
					<text class="no-commodity-txt">商家正在努力上新中...</text>
				</view>
			</view>
		</view>

		<tabBar :currentPage="currentPage"></tabBar>
	</view>
</template>

<script>
	import {
		api
	} from "./api.js"
	// 高德地图 api
	import amap from '../../libs/amap-wx.js';
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	// 商品展示瀑布流
	import WaterfallFlow from '../components/waterfall-flow/nairenk-waterfall-flow.vue'
	export default {
		data() {
			return {
				status: 0, // 状态栏高度
				navHeight: 0, // 导航栏高度(包含状态栏)
				navColor: '', //导航栏颜色
				swiperHeight: 0, // 轮播图高度

				routerList: [], // 商品分类
				specialRouter: {}, // 特殊推荐

				current: 0,
				swiperCurrent: 0,
				currentPage: 'homePage',
				areas: [],
				amapPlugin: null,
				key: '4226617a8bb2e82f8a0a6e42958a5d43',
				titleNViewBackground: '',
				swiperLength: 0,
				carouselList: [],
				defaultRegion: '',
				regionIndex: 1,
				guessList: [],
				goodsList: [],
				addressName: '',
				tabBars: ["全部"],
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true,

				showNoGuess: true,
				showNoGoods: true
			};
		},
		components: {
			tabBar,
			WaterfallFlow
		},
		onShow() {
			this.wxGetLogin();
			api.getContent().then(res=>{
				console.info(res.data)
				if(res.data.code == 200){
					this.tabBars = this.tabBars.concat(res.data.data);
					wx.setStorageSync('tabBars', this.tabBars)
					this.tabBars = ["全部"]
				}
			}).catch(err=>{
				console.log(err);
			})
		},
		onLoad() {
			this.setNavSize();

			this.getHomepageRouter();

			// 计算轮播图高度并存储
			this.swiperHeight = (2 * this.navHeight + this.status) * 7 / 3;
			
			// 在页面中定义插屏广告
			let interstitialAd = null
			
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
			  interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-55e568586015fbe2'
			  })
			  interstitialAd.onLoad(() => {})
			  interstitialAd.onError((err) => {})
			  interstitialAd.onClose(() => {})
			}
			
			// 在适合的场景显示插屏广告
			if (interstitialAd) {
			  interstitialAd.show().catch((err) => {
			    console.error(err)
			  })
			}
		},
		// 向下滑动刷新
		onReachBottom() {
			this.page++;
			this.loading = true;
			this.getList();
		},
		onPageScroll: function(e) {
			// 滚动到指定位置，导航栏变色
			// this.swiperHeight为轮播图的高度
			if (e.scrollTop > this.swiperHeight) {
				this.navColor = 'background: #DE2032';
			} else {
				this.navColor = '';
			}
		},
		methods: {
			/** 首页分类数据获取 */
			initPosition: function() {
				console.log('登录');
				let _this = this;
				uni.getLocation({
				          type: 'wgs84',
				          success: function(res) {
							uni.setStorageSync('latitude', res.latitude)
							uni.setStorageSync('longitude', res.longitude)
							_this.getGuess();
				        },
						fail() {
							uni.setStorageSync('latitude', null)
							uni.setStorageSync('longitude', null)
							_this.getGuess();
						}
				});
			},
			getHomepageRouter: function() {
				let params = {
					menuIdentityCode: 'WCPHomepageNav'
				};
				api.getHomepageRouter(params).then(res => {
					console.log('首页商品分类数据获取');
					console.log(res);
					if (res.data.data.length > 0) {
						this.routerList = res.data.data;
					}
				}).catch(err => {
					console.log(err);
					this.routerList = [];
				});

				let params2 = {
					menuIdentityCode: 'WCPSpecNav'
				};
				api.getHomepageRouter(params2).then(res => {
					console.log('首页特殊商品分类数据获取');
					console.log(res);
					if (res.data.data.length > 0) {
						this.specialRouter = res.data.data[0];
					}
				}).catch(err => {
					console.log(err);
					this.specialRouter = {};
				});
			},
			/** 路由跳转事件，index=-1，为特殊推荐 */
			navToRoute: function(target) {
				let index = target.currentTarget.dataset.index;
				let routePath = {};
				if (index === 'specical') {
					wx.setStorageSync('content', this.specialRouter.menuName);
					routePath = this.specialRouter.androidPath;
				} else {
					wx.setStorageSync('content', this.routerList[index].menuName);
					routePath = this.routerList[index].androidPath;
				}
				

				// 跳转到分类页面
				uni.navigateTo({
					url: routePath,
				});
			},
			/** 计算并存储导航栏，状态栏高度 */
			setNavSize: function() {
				let that = this;
				let sysinfo = wx.getSystemInfoSync();
				this.status = sysinfo.statusBarHeight;
				let isiOS = sysinfo.system.indexOf('iOS') > -1;
				let navHeight;
				if (!isiOS) {
					this.navHeight = 48;
				} else {
					this.navHeight = 44;
				}
			},
			// 选中
			choose: function(item) {
				if(item.jumpto?.substr(0,5) === 'https'){
					console.log(item.jumpto);
					this.list = []
					uni.navigateTo({
						url:'/pages/h5/h5?url='+encodeURIComponent(item.jumpto)
					})
				} else {
					//测试数据没有写id，用title代替
					let id = item.commodityId;
					uni.navigateTo({
						url: `/pages/product/product?id=${id}`,
					});
				}
				
			},
			// 加载数据
			getList: function() {
				if (this.list.length < this.guessList.length) {
					setTimeout(() => {
						console.log(this.list);
						this.end = this.page * 10;
						this.list = this.list.concat(this.guessList.slice(this.start, this.end));
						console.log(this.list);
						this.start = this.end;
						// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
						let _this = this;
						setTimeout(() => {
							_this.loading = false;
						}, 120);
					}, 1000)
				} else {
					this.loading = false;
				}
			},
			// 跳转搜索页面
			getToSearch(){
				uni.navigateTo({
					url: `/pages/search/search`
				})
			},
			//轮播图切换
			swiperChange: function(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},

			changeSwiper: function(e) {
				this.swiperCurrent = e.detail.current;
			},
			/**
			 * web页面跳转
			 * 0. 后台公告页面跳转
			 * 1. 无跳转
			 * 2. 小程序页面跳转
			 * @param {Object} item
			 */
			navToWebView: function(item) {
				if (item.announcementType == '0') {
					// 公告页面跳转
					let resulturl = item.announcementContent
					getApp().globalData.desc = resulturl
					uni.navigateTo({
						url: `/pages/webView/webView`
					})
				} else if (item.announcementType == '1') {
					// 无跳转
					return
				} else {
					// 本地页面跳转
					let resulturl = item.announcementContent
					uni.navigateTo({
						url: `${resulturl}`
					})
				}
			},
			//详情页
			navToDetailPage: function(item) {
				//测试数据没有写id，用title代替
				let id = item.commodityId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`,
				})
			},
			bindPickerChange: function(val) {
				this.addressName = this.areas[val.detail.value]
				uni.setStorageSync('location', this.areas[val.detail.value]);
				this.defaultRegion = this.areas[val.detail.value]
				this.getBanner();
				this.getGuess();
				this.getAreas();
			},
			//判断是否登录
			wxGetLogin: function() {
				let _this = this
				uni.checkSession({
					success: function() {
						_this.getUserMes();
						if (uni.getStorageSync('token')) {
							uni.setStorageSync('loginState', true);
						} else {
							uni.setStorageSync('loginState', false);
							// uni.showToast({
							// 	title:'请先进行登录',
							// 	icon:"none",
							// 	duration: 1000,
							// })
							// uni.navigateTo({
							//   url: `/pages/index/index`
							// })
						}

						console.log(uni.getStorageSync('loginState'))
					},
					fail: function() {
						uni.setStorageSync('loginState', false);
						console.log(uni.getStorageSync('loginState'))
					}
				})
			},
			/**
			 * 获取用户信息
			 */
			getUserMes: function() {
				let user = {
					// 此处默认传入重庆市
					// 用户信息和地区无关
					area: '重庆市'
				};
				api.getUserInfo(user).then(res => {
					console.log('用户信息');
					console.log(res);
					this.service = res.data.data;
					console.log(this.service);
					// userType 说明
					// 0: app
					// 1: 企业
					// 2: 小程序
					uni.setStorageSync('userId', this.service.userId);
					console.log(this.service.userId);
					uni.setStorageSync('userType', this.service.userType);
					//缓存电话
					uni.setStorageSync('bindingAccount', this.service.bindingAccount);
					console.log(this.service.bindingAccount);
					// 默认重庆（debug）
					// uni.setStorageSync('location', "重庆市");
					// 当前用户是否为VIP
					uni.setStorageSync('isVip', this.service.isVip == 0 ? false : true);
					// 当前地区是否有VIP业务
					uni.setStorageSync('haveVip', this.service.haveVip == 0 ? false : true);
					//储存绑定信息
					uni.setStorageSync('bindingId', this.service.bindingid);
					// 存储角色信息
					uni.setStorageSync('roleNameList', this.service.roleNameList);

				}).catch(err => {
					console.log(err)
				});
			},

			/**
			 * 获取轮播图信息
			 */
			getBanner: function() {
				let location = {
					locationCode: 'WCPHomePage'
				};
				api.getBannerImgs(location).then(res => {
					console.log('轮播图数据');
					console.log(res);
					this.carouselList = res.data.data;
					this.swiperLength = this.carouselList.length;
				}).catch(err => {
					console.log(err)
				})
			},

			/**
			 * 获取地区列表信息
			 */
			getAreas: function() {
				api.getAreas().then(res => {
					if (res.data.data) {
						this.areas = res.data.data;
					}
				}).catch(err => {
					uni.showToast({
						title: '地区信息获取失败',
						icon: 'none'
					})
					console.log(err);
				})
			},
			/**
			 * 猜你喜欢
			 */
			getGuess: function() {
				// 清空现在已经加载的数据
				this.list = [];
				this.page = 1;
				this.start = 0;
				this.end = 0;
				// 显示刷新加载图片
				this.loading = true;

				// let userAndLocalMes_1 = {
				// 	area: uni.getStorageSync('location'),
				// 	shopPlace: 'Guess',
				// 	latitude: uni.getStorageSync('latitude'),
				// 	longitude: uni.getStorageSync('longitude')
				// };
				let valueArr = {
					area: '',
					content:'',
					salesVolume:0,
					salePrice:0,
					distance:1,
					latitude: uni.getStorageSync('latitude'),
					longitude: uni.getStorageSync('longitude'),
					commodityTitle:'',
					pageSize:12,
					page:1,
					showPlace: 'Guess',
				};
				// api.getProducts(userAndLocalMes_1)
				api.getClassification(valueArr).then(res => {
					this.guessList = res.data.data;
					this.showNoGuess = this.guessList.length == 0;

					uni.stopPullDownRefresh();
					this.getList();
				}).catch(err => {
					uni.stopPullDownRefresh();
					console.log(err);
					this.guessList = [];
					this.showNoGuess = true;
				})
			},
			/**
			 * 页面数据获取
			 */
			getPageData: function() {
				this.defaultRegion = uni.getStorageSync('location') || '';
				
				if (this.defaultRegion == '') {
					this.defaultRegion = '选择地区';
				}
				this.initPosition();
				this.getBanner();
				this.getAreas();
			}
		},
		onPullDownRefresh() {
			this.getBanner();
			this.getGuess();
			this.getAreas();
		},
		mounted() {
			uni.showLoading({
				title: '获取信息中'
			});
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});

			this.amapPlugin.getPoiAround({
				success: (data) => {
					uni.hideLoading();
					// this.addressName = data.poisData[0].cityname;
					let adname = data.poisData[0].adname;
					if (adname === undefined || adname == null) {
						uni.setStorageSync('location', '');
					} else {
						console.log('地区:' + adname);
						uni.setStorageSync('location', adname);
					}
					this.getPageData();
				},
				fail: (res) => {
					uni.hideLoading();
					console.log(res);
					uni.setStorageSync('location', '');
					this.getPageData();
				}
			});
		}
		// #ifndef MP

		// #endif
	}
</script>

<style lang="scss">
	.container {
		height: 100vh;
	}

	.width-max {
		width: 100%;
	}

	.nav-title-txt {
		font-size: 32rpx;
		color: #FFFFFF;
		text-align: center;
		font-weight: 500;
	}

	.nav-box {
		position: fixed;
		width: 100%;
		z-index: 1;

		.nav-content-box {
			width: 100%;
			display: flex;
			flex-direction: row;

			.search-box {
				margin: auto 5% auto 0;
				display: flex;
				margin-left: 10rpx;
				border-radius: 25rpx;
				background: rgba(255, 255, 255, 0.8);
				width: 538rpx;

				.search-placeholder-txt {
					color: #999999;
					font-size: 26rpx;
				}

				.search-icon {
					margin: auto 10rpx auto 20rpx;
				}

				.search {
					margin: auto 0;
					width: 470rpx;
					height: 100%;
				}
			}
		}
	}



	.header {
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

	.picker-region {
		display: flex;
		margin: auto 0 auto 5%;
		font-size: 28rpx;
	}

	.drop-down {
		width: 22rpx;
		height: 14rpx;
		margin: auto 14rpx auto 7rpx;
	}

	.r-m-t {
		margin-top: -15rpx;
	}

	// 精选商品微调
	.title-adapt {
		// padding-top: 10rpx;
	}

	/* #ifdef MP */
	.mp-search-box {
		position: absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;

		.ser-input {
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color: $font-color-base;
			border-radius: 20px;
			background: rgba(255, 255, 255, .6);
		}
	}

	page {
		.cate-section {
			margin-top: -15rpx;
			background: #F8F9FB;
			// position: relative;
			z-index: 5;
			border-radius: 25upx 25upx 0 0;
			// margin-top:-45upx;
		}

		.carousel-section {
			z-index: -1;
			background: #F8F9FB;
			width: 100%;

			.swiper-dots {
				left: 45upx;
				bottom: 40upx;
			}

			.carousel {
				width: 100%;
				// height: 516rpx;
				// height: 265px;

				.carousel-item {
					width: 100%;
					height: 100%;
					padding: 0;
					overflow: hidden;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	/* #endif */


	// page {
	// 	background: #ffffff;
	// }
	.m-t {
		margin-top: 16upx;
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

	.area-picker-txt {
		font-weight: 500;
		font-size: 28rpx;
		color: #FFFFFF;
	}

	// 暂无商品样式
	.no-commodity-container {
		width: 100%;
		height: 397.2rpx;
		display: flex;
		justify-content: center;
	}

	.no-commodity-content {
		display: flex;
		flex-direction: column;
		margin: auto;
		align-items: center;
	}

	.no-commodity-img {
		width: 230rpx;
		height: 230rpx;
	}

	.no-commodity-txt {
		font-size: 28rpx;
		color: #CCCCCC;
		margin-top: 40rpx;
	}

	.main-content-box {
		position: relative;
		top: -40rpx;
		background-color: rgba($color: #FFFFFF, $alpha: 1.0);
		border-top-right-radius: 35rpx;
		border-top-left-radius: 35rpx;
	}

	.main-content-placeholder {
		height: 35rpx;
	}

	.category-box {
		width: 97%;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.category-content {
		display: flex;
		flex: 0 0 20%;
		flex-direction: column;
		margin-bottom: 10rpx;
	}

	.category-content-img-box {
		margin: 0 auto;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		margin-bottom: 5rpx;
	}

	.category-content-img {
		width: 52rpx;
		height: 66rpx;
		margin: auto;
	}

	.category-content-txt {
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
	}

	/* 通用栏目标题 */
	.section-title-txt {
		margin: 32rpx 0 30rpx 5%;
		color: #333333;
		font-size: 32rpx;
		font-weight: bold;
	}

	.special-rec-section {
		width: 90%;
		margin: 0 5%;
		height: 259rpx;
	}

	.special-rec-section-img {
		width: 100%;
		height: 100%;
	}

	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding-left: 5%;
		padding-right: 5%;
		width: 90%;
		padding-bottom: 400rpx;

		.guess-content {
			width: 100%;
		}

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 10px;
			overflow: hidden;
			// border-color: #E3E3E3;
			// border-width: 1px;
			border: 2upx solid #E3E3E3;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
				// border: 2upx solid #E3E3E3
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
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
