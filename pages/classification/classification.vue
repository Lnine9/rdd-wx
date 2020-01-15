<template>
	<view>
		<!-- 滑动导航栏 -->
		<view>
			<navTab ref="navTab" :tabBars="tabBars" @change="change"></navTab>
		</view>
		<view>
			<HMfilterDropdown :filterData="filterData" :defaultSelected ="filterDropdownValue" :updateMenuName="false" @confirm="confirm"></HMfilterDropdown>
		</view>
		<!-- 商品展示 -->
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
				},
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
				showNoGuess:false,
				list: [], // 列表
				guessList:[],
				page: 1,
				start: 0,
				end: 0,
				loading: true,
				currentPage: 'classification',
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			//定时器模拟ajax异步请求数据
			this.getAreas();
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
			this.page++;
			this.loading = true;
			this.getList();
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
			getClassification(){
				api.getClassification(this.valueArr).then(res=>{
					if(res.data.data.length!=0){
						this.showNoGuess=false;
						this.guessList = res.data.data;
						uni.stopPullDownRefresh();
						this.getList();
					}
					else{
						this.showNoGuess=true;
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
			// 加载数据
			getList: function() {
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
			// 选中
			choose(item) {
				//测试数据没有写id，用title代替
				let id = item.commodityId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`,
				})
			},
			change(index){
				this.valueArr.content=this.tabBars[index].name;
				this.list=[];
				this.guessList=[];
				this.page=1;
				this.start=0;
				this.end=0;
				this.loading=true;
				this.getClassification();
			},
			confirm(e){
				this.list=[];
				this.guessList=[];
				this.page=1;
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
				}
				else if(e.index[1]==1){
					this.valueArr.distance=1;
					this.valueArr.salePrice=0;
				}
				else if(e.index[1]==2){
					this.valueArr.distance=0;
					this.valueArr.salePrice=2;
				}
				else{
					this.valueArr.distance=0;
					this.valueArr.salePrice=1;
				}
				this.valueArr.salesVolume=(Number)(e.value[2]);
				this.getClassification();
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 50rpx;
		background: #F8F9FB;
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
