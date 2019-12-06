<template>
	<view style="margin-bottom: 40rpx;">
		<view class="QS-tabs-box">
			<scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft">
				<view 
					v-for="(item,index) in tabs" :key="index"
					class="nav-item"
					:class="{select: index === swiperCurrent}"
					@click="change(index)"
				>{{item}}</view>
			</scroll-view>
		</view>
		<swiper 
		:style="{'height': '1200rpx'}" 
		:current="swiperCurrent">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
				<scroll-view scroll-y style="height: 100%;width: 100%;" >
					<view class="scroll-items">
						<view style="position: relative">
							<view style="background-color: #FFFFFF;height: 250rpx;">
								<image class="pic" src="../../static/withdraw/withdraw.png"></image>
								<text style="font-size: 23rpx;color: #999999;position: relative;top: 28rpx;left: 270rpx;">
									金额共为 （元）
								</text>
								<view style="width: 700rpx;text-align: center;font-weight: bold;font-size: 60rpx;position: relative;top: 40rpx;left: 20rpx;">
								{{total.toFixed(2)}}
								</view>
							</view >
							<view v-show="showType">
								<image class="noAddress" src="../../static/myOrder/myOrderNoData.png"></image>
								<text class="warning">暂无订单</text>
							</view>
							<view style="width: 750rpx;background: #FFFFFF;" v-show="!showType">
								<view style="border-left: rgb(39, 134, 217) 5rpx solid;margin: 30rpx 0 0 20rpx;padding: 10rpx 0 0 20rpx ;">订单信息</view>
								<view v-for="(commodity, index) in commodityList" :key="index" class="commodity">
									<view class="theType" v-show="commodity.commodityType==2">
										<view class="detail1">订单号:
										<text class="text"> {{commodity.orderId}}</text>
										<text class="orderState" :class="{'active':commodity.orderState==2}">{{orderState[index]}}</text>
										</view>
										<view class="detail1">电子码:<text class="text"> {{commodity.electronicCode}}</text></view>
									</view>
									<view class="theType" v-show="commodity.commodityType==1">
										<view class="detail1">快递单号:<text class="text"> {{commodity.orderId}}</text></view>
										<view class="detail1">快递状态:<text class="text"> {{state[index]}}</text></view>
									</view>
									<view class="details">
										<view class="detail3">商品名:<text class="text"> {{commodity.commodityTitle}}</text></view>
										<view class="detail">支付金额 (元):<text class="text"> {{commodity.actualPrice*commodity.commodityNum}}</text></view>
										<view class="detail">数量 (个):<text class="text"> {{commodity.commodityNum}}</text></view>
										<view class="detail2">时间:<text class="text"> {{commodity.createAt}}</text></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<tabBar :currentPage="currentPage"></tabBar>
	</view>
</template>

<script>
	import {api} from './api.js';
	import tabBar from '../components/zwy-tabBar/tabBar.vue';
	const Sys = uni.getSystemInfoSync();
	const wH = Sys.windowHeight;
	let n = 1;
	const tabs = Array(10).fill('').map(()=> 'tab' + Array(n).fill('s').join('') + n++);
	export default {
		components: {
			tabBar
		},
		data() {
			return {
				currentPage:'shopOrder',
				orderState:[],
				state:[],
				total:0,
				showType:true,
				tabs:["全部","未确认","已确认"],
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				commodityList:[]
			}
		},
		onLoad() {
			this.getAllCommodityOrderByLeader(this.swiperCurrent);
		},
		methods: {
			change(index) {
				this.swiperCurrent = index;
				this.getAllCommodityOrderByLeader(index);
				
				
			},
			getAllCommodityOrderByLeader(index){
				this.total=0;
				this.state=[];
				this.orderState=[];
				if(index==0){
					index='';
				}
				else{
					index=index-1;
				}
				api.getAllCommodityOrderByLeader({
					orderState: index
				}).then(res=>{
					this.commodityList=[];
					if(res.data.data.length!=0)
					{
						this.commodityList=res.data.data;
						this.showType=false;
						for(let i=0;i<res.data.data.length;i++){
							this.total=this.total+this.commodityList[i].actualPrice*this.commodityList[i].commodityNum;
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
					}
					else{
						this.showType=true;
					}
				}).catch(err=>{
					console.log(err)
				});
			}
		}
	}
</script>

<style>
	page {
		padding-bottom: 50rpx;
		background: #F8F9FB;
	}
	.select{
		background-color: #007AFF;
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
	.pic {
		position: relative;
		top: 40rpx;
		left: 240rpx;
		width: 43rpx;
		height: 43rpx;
	}
	.QS-tabs-box{
		width: 100%;
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: white;
	}

	.scroll-items{
		display: flex;
		flex-direction: column;
		width: 750rpx;
	}
	.scroll-item{
		margin-top: 15rpx;
		padding: 25rpx;
		background-color: white;
		border-radius: 8rpx;
		width: 100%;
		display: flex;
		flex-direction: row;
		border: 1px solid #f8f8f8;
	}
	.scroll-item-image-box{
		flex-grow: 0;
	}
	.scroll-item-text-box{
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 28rpx;
		font-weight: bold;
		margin-left: 15rpx;
	}
	.scroll-item-image{
		border-radius: 4rpx;
		width: 180rpx;
		height: 150rpx;
	}
	.select_box{
	  position: relative;
	 left: 10rpx;
	 top: 10rpx;
	}
	.select_box .select{
	  width: 300rpx;
	  height: 50rpx;
	  background:rgba(255,255,255,1);
	  border: 1px solid black;
	  border-radius: 20rpx;
	  display: flex;
	  align-items: center;
	  text-align: center;
	}
	.select_box .select .select_text{
	  font-size: 26rpx;
	  color: #333333;
	  line-height: 28rpx;
	  flex: 1;
	}
	.select_box .select .select_img{
	  width: 30rpx;
	  height: 30rpx;
	  display: block;
	  transition:transform 0.3s;
	}
	.select_box .select .select_img_rotate{
	  transform:rotate(180deg); 
	}
	.select_box .option_box{
		z-index: 100;
	  position: absolute;
	  top: 55rpx;
	  width: 200rpx;
	}
	.select_box .option_box .option{
	  display: block;
	   border-radius: 20rpx;
	  text-align: center;
	  color: #999999;
	  width: 300rpx;
	  height: 50rpx;
	  line-height: 50rpx; 
	  font-size: 26rpx;
	  border: 1px solid black;
	}
	.money {
		position: absolute;
		top: 100rpx;
		left: 180rpx;
	}
	.details {
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
	}
	.detail {
		color: #CCCCCC;
		margin-top: 20rpx;
		width: 350rpx;
		font-size: 35rpx;
	}
	.detail1 {
		color: #CCCCCC;
		margin-top: 20rpx;
		width: 900rpx;
		font-size: 35rpx;
	}
	.detail2 {
		color: #CCCCCC;
		width: 400rpx;
		font-size: 35rpx;
		margin: 20rpx 295rpx 0 0;
	}
	.detail3 {
		color: #CCCCCC;
		width: 450rpx;
		font-size: 35rpx;
		margin:20rpx 245rpx 0 0;
	}
	.detail4{
		color: #CCCCCC;
		width: 500rpx;
		font-size: 35rpx;
		margin-top: 15rpx;
	}
	.orderState{
		color: #06C1AE;
		margin-left: 120rpx;
		font-size: 30rpx;
	}
	.active{
		color: red;
	}
	.text {
		color: black;
		margin-left: 15rpx;
		font-size: 30rpx;
	}
	.theType {
		margin-left: 29rpx;
	}
	.warning{
		display: flex;
		align-items: center;
		justify-content: center;
		color: #CCCCCC;
	}
	.noAddress{
		margin-left: 280rpx;
		margin-top: 200rpx;
		width: 200rpx;
		height: 200rpx;
	}
	.commodity{
		margin-top: 40rpx;
		border-top: 1rpx solid #CCCCCC;
	}
</style>
