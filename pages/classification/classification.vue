<template>
	<view style="margin-bottom: 40rpx;">
		<navTab ref="navTab" :tabBars="tabBars"></navTab>
		<!-- 商品展示 -->
		<view class="guess-section" v-if="!showNoGuess">
			<waterfall-flow class="guess-content" :list="list" :loading="loading"></waterfall-flow>
		</view>
		<!-- 暂无商品的情况 -->
		<view class="no-commodity-container" style="padding-bottom: 110rpx;" v-else>
			<view class="no-commodity-content">
				<image src="/static/homepage/no-commodity-img.png" mode="aspectFill" class="no-commodity-img"></image>
				<text class="no-commodity-txt">商家正在努力上新中...</text>
			</view>
		</view>
		<tabBar :currentPage="currentPage"></tabBar>
	</view>
</template>

<script>
	import {api} from './api.js';
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	import navTab from '../components/classify/navTab.vue';
	// 商品展示瀑布流
	import WaterfallFlow from '../components/waterfall-flow/nairenk-waterfall-flow.vue'
	const Sys = uni.getSystemInfoSync();
	const wH = Sys.windowHeight;
	let n = 1;
	const tabs = Array(10).fill('').map(()=> 'tab' + Array(n).fill('s').join('') + n++);
	export default {
		filters: {
			ellipsis(value) {
				if (!value) return ''
				if (value.length > 10) {
					return value.slice(0, 10) + '...'
				}
				return value
			}
		},
		components: {
			tabBar,
			navTab,
			WaterfallFlow
		},
		data() {
			return {
				currentPage:'shopOrder',
				orderState:[],
				state:[],
				total:0,
				showType:true,
				tabBars: [{
					name: '餐饮美食',
					id: 'meishi'
				}, {
					name: '休闲娱乐',
					id: 'yule'
				}, {
					name: '丽人优享',
					id: 'liren'
				}, {
					name: '运动健康',
					id: 'yundong'
				}, {
					name: '母婴亲子',
					id: 'muying'
				}],
				swiperCurrent: 0,
				commodityList:[],
				orderId:'',
				showNoGuess:true,
				list: [], // 列表
				loading: true,
				currentPage: 'homePage',
			}
		},
		methods: {
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
			getAllCommodityOrderByLeader(index){
				this.state=[];
				this.orderState=[];
				if(index==0){
					index='';
				}
				this.commodityList=[];
				api.getAllCommodityOrderByLeader({
					orderState: index
				}).then(res=>{
					this.total=0;
					if(res.data.data.length!=0)
					{
						this.commodityList=res.data.data;
						console.log(this.commodityList);
						this.showType=false;
						
						
						
						for(let i=0;i<res.data.data.length;i++){
							
							if (this.commodityList[i].attrInfo != undefined && this.commodityList[i].attrInfo != null && this.commodityList[i].attrInfo != '') {
								// 商品属性信息json->string
								let map = JSON.parse(this.commodityList[i].attrInfo);
								this.commodityList[i].attrInfo = '';
								for(var key in map) {
									this.commodityList[i].attrInfo += map[key] + '，';
								}
								this.commodityList[i].attrInfo = this.commodityList[i].attrInfo.slice(0, this.commodityList[i].attrInfo.length - 1);
							} else {
								this.commodityList[i].attrInfo = null;
							}
							
							if(this.commodityList[i].deliveryState==0){
								this.state[i]='未寄送';
							}else if(this.commodityList[i].deliveryState==1){
								this.state[i]='已寄送';
							}else if(this.commodityList[i].deliveryState==2){
								this.state[i]='已签收';
							}else{
								this.state[i]='--';
							};
							
							
							if(this.commodityList[i].orderState==1){
								this.orderState[i]='未确认';
							}else if(this.commodityList[i].orderState==2){
								this.orderState[i]='已确认';
							}else{
								this.orderState[i]='--';
							}
						}
						console.log(this.state,this.orderState)
						for(let i=0;i<this.commodityList.length;i++){
						this.total=this.total+this.commodityList[i].actualPrice;
						}	
					}
					else{
						this.showType=true;
					}
				}).catch(err=>{
					console.log(err)
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 50rpx;
		background: #F8F9FB;
	}
	.select{
			background-color: #06C1AE;
	}
	.nav-item{
		display: inline-block;
		width: 250upx;
		height: 90upx;
		text-align: center;
		line-height: 90upx;
		font-size: 30upx;
		color: #303133;
		position: relative;
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
	
	.QS-tabs-box{
		width: 100%;
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: white;
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
</style>
