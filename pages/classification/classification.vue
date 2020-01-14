<template>
	<view>
		<view class="searchHead" v-if="!isSearch">
			<view class="searchBorder">
				<image class="searchImg" src="../../static/search.png"></image>
				<input class="searchFont" placeholder="请输入要搜索的商品" placeholder-style="color:#FFFFFF" />
			</view>
			<text class="cancel">取消</text>
		</view>
		<!-- 滑动导航栏 -->
		<view v-else>
			<navTab ref="navTab" :tabBars="tabBars"></navTab>
		</view>
		<view>
			<HMfilterDropdown :filterData="filterData" :defaultSelected ="filterDropdownValue" :updateMenuName="false" @confirm="confirm"></HMfilterDropdown>
		</view>
		<!-- 商品展示 -->
		<!-- <view class="guess-section" v-if="!showNoGuess">
			<waterfall-flow class="guess-content" :list="list" :loading="loading"></waterfall-flow>
		</view> -->
		<!-- 暂无商品的情况 -->
		<!-- <view class="no-commodity-container" style="padding-bottom: 110rpx;" v-else>
			<view class="no-commodity-content">
				<image src="/static/homepage/no-commodity-img.png" mode="aspectFill" class="no-commodity-img"></image>
				<text class="no-commodity-txt">商家正在努力上新中...</text>
			</view>
		</view> -->
		<tabBar :currentPage="currentPage"></tabBar>
	</view>
</template>

<script>
	import {api} from './api.js';
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	import navTab from '../components/classify/navTab.vue';
	import HMfilterDropdown from '../components/HM-filterDropdown/HM-filterDropdown.vue';
	import data from '../components/HM-filterDropdown/data.js';
	// 商品展示瀑布流
	import WaterfallFlow from '../components/waterfall-flow/nairenk-waterfall-flow.vue'
	const Sys = uni.getSystemInfoSync();
	const wH = Sys.windowHeight;
	let n = 1;
	const tabs = Array(10).fill('').map(()=> 'tab' + Array(n).fill('s').join('') + n++);
	export default {
		components: {
			tabBar,
			navTab,
			WaterfallFlow,
			HMfilterDropdown
		},
		data() {
			return {
				indexArr:'',
				valueArr:'',
				isSearch:false,
				filterDropdownValue:[],
				filterData:[],
				tabBars: [{
					name: '餐饮美食',
				}, {
					name: '休闲娱乐',
				}, {
					name: '丽人优享',
				}, {
					name: '运动健康',
				}, {
					name: '母婴亲子',
				}],
				swiperCurrent: 0,
				regionList:[],
				showNoGuess:true,
				list: [], // 列表
				loading: true,
				currentPage: 'classification',
				latitude: 0.00,
				longitude: 0.00,
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			//定时器模拟ajax异步请求数据
			this.getAreas();
			this.getClassfication();
			setTimeout(()=>{
				this.filterDropdownValue = [[0],[0],[0]];
				this.filterData = data; 
			},100);
			//模拟ajax请求子菜单数据。
			setTimeout(()=>{
				this.filterData[0].submenu=this.filterData[0].submenu.concat(this.regionList);
			},2000);
			
		},
		onShow() {
			this.latitude = wx.getStorageSync('latitude')
			this.longitude = wx.getStorageSync('longitude')
			console.info(this.latitude)
		},
		onPullDownRefresh: function() {
			wx.showNavigationBarLoading() //在标题栏中显示加载
			this.change(this.swiperCurrent); //重新加载数据
			//模拟加载  1秒
			setTimeout(function() {
				// complete
				wx.hideNavigationBarLoading() //完成停止加载
				wx.stopPullDownRefresh() //停止下拉刷新
			}, 1000);
		},
		methods: {
			getAreas(){
				api.getAreas().then(res=>{
					for(let i=0;i<res.data.data.length;i++){
						let region={
							name:null,
							value:null
						}
						region.name=res.data.data[i];
						region.value=res.data.data[i];
						this.regionList=this.regionList.concat(region);
						console.info(this.regionList)
					}
				}).catch(err=>{
					console.log(err);
				});
				uni.getLocation({
				          type: 'wgs84', 
				          success: function(res) {
							wx.setStorageSync('latitude', res.latitude)
							wx.setStorageSync('longitude', res.longitude)
				        }
				})
			},
			confirm(e){
				this.indexArr = e.index
				this.valueArr = e.value
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 50rpx;
		background: #F8F9FB;
	}
	.searchHead{
		display: inline-block;
		width: 750rpx;
		height: 110rpx;
		background-color: #de2032;
	}
	.searchBorder{
		position: relative;
		left: 30rpx ;
		top: 10rpx;
		width: 600rpx;
		height: 76rpx;
		background-color: #ed8794;
		border-radius: 50rpx;
	}
	.cancel{
		position: absolute;
		right: 50rpx;
		top: 30rpx;
		color: #FFFFFF;
	}
	.searchImg{
		position: absolute;
		left: 23rpx;
		top: 18rpx;
		width: 40rpx;
		height: 40rpx;
	}
	.searchFont{
		position: absolute;
		left: 85rpx;
		top: 18rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	 /* 暂无商品样式 */
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
	
	/* 商品内容 */
	.guess-section {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding-left: 5%;
		padding-right: 5%;
		width: 90%;
		padding-bottom: 110rpx;
	
		.guess-content {
			width: 100%;
		}
	}
</style>
