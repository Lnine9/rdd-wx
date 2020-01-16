<template>
	<view>
		<view class="searchHead" v-if="!isSearch">
			<view class="searchBorder">
				<image class="searchImg" src="../../static/search/search.png"></image>
				<input class="searchFont" disabled :placeholder="inputSerach" placeholder-style="color:#FFFFFF" @click="getToSearch()"/>
			</view>
			<text class="cancel" @click="back()">取消</text>
		</view>
		<!-- 滑动导航栏 -->
		<view v-else>
			<navTab ref="navTab" :tabBars="tabBars" @change="change"></navTab>
		</view>
		<view>
			<HMfilterDropdown :filterData="filterData" :defaultSelected ="filterDropdownValue" :updateMenuName="false" @confirm="confirm"></HMfilterDropdown>
		</view>
		<!-- 商品展示 -->.
		<view class="guess-section" v-show="!showNoGuess">
			<waterfall-flow class="guess-content" :list="list" :loading="loading" @click="choose"></waterfall-flow>
		</view>
		<!-- 暂无商品的情况 -->
		<view class="no-commodity-container" style="padding-bottom: 110rpx;" v-show="showNoGuess">
			<view class="no-commodity-content">
				<image src="/static/homepage/no-commodity-img.png" mode="aspectFill" class="no-commodity-img"></image>
				<text class="no-commodity-txt">商家正在努力上新中...</text>
			</view>
		</view>
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
				valueArr:{
					area:'',
					content:'',
					salesVolume:0,
					salePrice:0,
					distance:0,
					latitude: 0.00,
					longitude: 0.00,
					commodityTitle:'',
					pageSize:10,
					page:1,
				},
				filterDropdownValue:[],
				filterData:[],
				inputSerach:'请输入要搜索的商品',
				tabBars: ["全部"],
				swiperCurrent: 0,
				regionList:[],
				isSearch:true,
				list: [], // 列表
				guessList:[],
				loading: true,
				currentPage: 'classification',
				showNoGuess:false
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			if(option.key != undefined){
				wx.setStorageSync('inputSerach', option.key)
				wx.setStorageSync('isSearch', option.isSearch)
			}
			if(option.content != undefined){
				wx.setStorageSync('content', option.content)
			}
			//定时器模拟ajax异步请求数据
			this.getAreas();
			this.getContent();
			this.getClassification();
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
			this.valueArr.latitude = wx.getStorageSync('latitude')
			this.valueArr.longitude = wx.getStorageSync('longitude')
			if(wx.getStorageSync('inputSerach') != ''){
				this.inputSerach = wx.getStorageSync('inputSerach')
				this.isSearch = wx.getStorageSync('isSearch')
			}
			if(wx.getStorageSync('content') != ''){
				this.valueArr.content = wx.getStorageSync('content')
			}
			if(wx.getStorageSync('inputSerach') != '' && wx.getStorageSync('content') != ''){
				this.isSearch = true;
			}
			uni.clearStorageSync();
		},
		onPullDownRefresh: function() {
			wx.showNavigationBarLoading() //在标题栏中显示加载
			this.getClassification(); //重新加载数据
			//模拟加载  1秒
			setTimeout(function() {
				// complete
				wx.hideNavigationBarLoading() //完成停止加载
				wx.stopPullDownRefresh() //停止下拉刷新
			}, 1000);
		},
		// 向下滑动刷新
		onReachBottom() {
			this.valueArr.page++;
			this.loading = true;
			this.getClassification();
		},
		methods: {
			getAreas(){
				api.getAreas().then(res=>{
					for(let i=0;i<res.data.data.length;i++){
						let region={
							name:null,
							value:null
						}
						if(res.data.data[i]=="重庆市"){
							continue;
						}
						region.name=res.data.data[i];
						region.value=res.data.data[i];
						this.regionList=this.regionList.concat(region);
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			getContent(){
				api.getContent().then(res=>{
					console.info(res.data)
					if(res.data.code == 200){
						this.tabBars = this.tabBars.concat(res.data.data);
					}
				}).catch(err=>{
					console.log(err);
				})
			},
			getClassification(){
				api.getClassification(this.valueArr).then(res=>{
					if(res.data.data.length!=0){
						this.showNoGuess=false;
						this.list=this.list.concat(res.data.data);
						this.loading=false;
						uni.stopPullDownRefresh();
					}
					else if(this.list==null){
						this.showNoGuess=true;
					}
					else{
						this.loading=false;
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
			// 选中
			choose(item) {
				//测试数据没有写id，用title代替
				let id = item.commodityId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`,
				})
			},
			change(index){
				this.valueArr.content=this.tabBars[index];
				console.info(this.valueArr.content);
				this.list=[];
				this.valueArr.page=1;
				this.start=0;
				this.end=0;
				this.loading=true;
				this.getClassification();
			},
			confirm(e){
				this.list=[];
				this.valueArr.page=1;
				this.start=0;
				this.end=0;
				this.loading=true;
				if(e.value[0]=="重庆市"){
					this.valueArr.area='';
				}
				else{
					this.valueArr.area=(String)(e.value[0]);
				}
				
				if(e.index[1]==0){
					this.valueArr.distance=0;
					this.valueArr.salePrice=0;
					this.valueArr.salesVolume=0;
				}
				else if(e.index[1]==1){
					this.valueArr.distance=1;
					this.valueArr.salePrice=0;
					this.valueArr.salesVolume=0;
				}
				else if(e.index[1]==2){
					this.valueArr.distance=0;
					this.valueArr.salePrice=2;
					this.valueArr.salesVolume=0;
				}
				else{
					this.valueArr.distance=0;
					this.valueArr.salePrice=1;
					this.valueArr.salesVolume=0;
				}
				if(e.index[2]!=0){
					this.valueArr.salesVolume=(Number)(e.value[2]);
					this.valueArr.distance=0;
					this.valueArr.salePrice=0;
				}
				else{
					this.valueArr.salesVolume=0;
					this.valueArr.distance=0;
					this.valueArr.salePrice=0;
				}
				this.getClassification();
			},
			//返回主页面
			back(){
				uni.navigateBack({
					url: `/pages/homePage/homePage`
				})
			},
			getToSearch(){
				uni.navigateBack({
					url: `/pages/search/search`
				})
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
		padding-top: 500rpx;
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
			margin-top: 200rpx;
			width: 100%;
		}
	}
</style>
