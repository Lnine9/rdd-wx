<template>
	<view>
		<!-- 商品展示 -->
		<view class="commodity-inner-container">
			<view class="commodity-img-container">
				<image :src="imageUrl" mode="" class="commodity-img"></image>
			</view>
			<view class="commodity-content-container">
				<!-- 商品名 -->
				<text class="commodity-title">
					{{order.commodityTitle}}
				</text>
			</view>
		</view>
		<!-- 快递信息 -->
		<view class="delivery-background">
			<image class="delivery-image" src="../../static/orderDetail/ic-position.png"></image>
			<text class="delivery-state">{{requestParams.deliveryCompany}}</text>
			<text class="delivery-info">快递单号:{{requestParams.deliveryNum}}</text>
		</view>
		<view class="total-wrap" >
			<block v-for="(item, index) in tracesData" :key="index">
				<trackNode :is-first="index===tracesData.length-1" :is-newest="index===0" :is-main-node="item.isMainNode" :node-data="item"></trackNode>
			</block>
		</view>
		<view class="no-delivery" :style="{display: hasTraces == true ? 'none' : 'block' }">
			<image class="no-delivery-image" src="../../static/orderDetail/ic-no-logistics.png"></image>
			<text class="no-delivery-text">抱歉，暂无此单号轨迹，请稍后再试！</text>
		</view>
	</view>
</template>
<script>
	import {DeliverAPI} from './deliverAPI.js'
	import {OrderDetailAPI} from './api.js'
    import trackNode from '../components/logisticsTrack/deliver.vue'
	
	export default {
		data() {
			return {
				hasTraces: true, // 是否有物流轨迹
				requestParams: { // 请求物流信息的参数
					deliveryNum: '',
					deliveryCompany: ''
				},
				order:[],
				imageUrl:'',
				tracesData: []
			}
		},
		components: {
		  trackNode
		},
		onLoad: function(params) {
			// console.log(params);
			if (params) {
				this.requestParams.deliveryNum = params.deliveryNum;
				this.requestParams.deliveryCompany = params.deliveryCompany;
				if(this.requestParams.deliveryNum == null){
					this.requestParams.deliveryNum = '暂无'
				}
				if(this.this.requestParams.deliveryCompany == null){
					this.this.requestParams.deliveryCompany = '暂无'
				}
				this.requestParams.orderId = params.orderId;
				this.getTraces();
			} else {
				this.hasTraces = false;
			}
			// 测试
			// this.requestParams.deliveryNum = '75313967739006';
			// this.requestParams.deliveryCompany = '中通快递';
			// this.getTraces();
			console.log(this.requestParams);
		},
		onShow() {
			this.getOrderDetail();
		},
		methods: {
			// 请求物流轨迹
			getTraces: function() {
				let _this = this;
				DeliverAPI.getDeliverInfo(this.requestParams).then(res => {
					console.log(res);
					if (res.data.data) {
						console.log(res.data.data.Traces);
						if(res.data.data.Traces!= null){
							 for(let i=res.data.data.Traces.length-1; i>=0; i--){
								 this.tracesData.push(res.data.data.Traces[i]) ;
							 }
							 console.log(this.tracesData);
						}else{
							this.tracesData = res.data.data.Traces;
							this.hasTraces = false;
						}
					} else {
						// todo 没有数据的情况
						console.log("无物流信息")
						this.hasTraces = false;
					}
				}).catch(err => {
					console.log(err);
					this.hasTraces = false;
					// todo 没有数据的情况
				});
			},
			//获取订单信息
			getOrderDetail(){
				let _this = this;
				OrderDetailAPI.getOrderDetail({
					// orderId: '1575463400271'
					orderId:_this.requestParams.orderId
				}).then(res => {
					console.log(res.data.data)
					this.order = res.data.data;
					// 图片地址
					if(this.order !=null){
						if (this.order.commodityImgList.length > 0) {
							this.imageUrl = this.order.commodityImgList[0];
						}
					}		
				}).catch(err => {
					uni.showToast({
						title: '获取订单信息失败，刷新试试',
						icon: 'none'
					});
				});
			},
		},
	}
</script>

<style lang="scss" scoped>
.total-wrap {
  width: 100vw;
  height: auto;
  box-sizing: border-box;
  padding: 20rpx 120rpx;
  .logistics-title {
    height: 72rpx;
    box-sizing: border-box;
    padding: 36rpx 0 8rpx;
    line-height: 28rpx;
    color: #4B4B4B;
    font-size: 26rpx;
    font-family: 'PingFangSC-Medium';
    text-align: left;
  }
}
.commodity-inner-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 220rpx;
		background: #FFFFFF;
	}
.commodity-img-container {
	margin: auto 30rpx auto 30rpx;
	border: #E3E3E3 1px solid;
	border-radius: 10rpx;
	width: 170rpx;
	height: 170rpx;
}
.commodity-img {
	padding: 18rpx;
	width: 140rpx;
	height: 140rpx;
}
.commodity-content-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: auto 0 auto 0;
	width: 520rpx;
	height: 170rpx;
}
.commodity-title {
	margin: auto 20rpx auto 0;
	color: #303038;
	font-size: 26rpx;
	font-weight: bold;
	display: -webkit-box;
	text-overflow: ellipsis;
	overflow: hidden;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
.delivery-background{
	position: relative;
	width: 750rpx;
	height: 150rpx;
	background-image: url(../../static/orderDetail/ic-background.png);
	background-position: 50%  0;
}
.delivery-image{
	width:50rpx;
	height:73rpx;
	margin: 36rpx 36rpx 41rpx 31rpx;
}
.delivery-state{
	position: absolute;
	top: 38rpx;
	font-size:32rpx;
	font-family:SimHei;
	font-weight:400;
	color:rgba(255,255,255,1);
}
.delivery-info{
	position: absolute;
	top: 84rpx;
	font-size:28rpx;
	font-family:SimHei;
	font-weight:400;
	color:rgba(255,255,255,1);
}
.no-delivery{
	width: 750rpx;
	height: 500rpx;
}
.no-delivery-image{
	display: inline-block;
	width: 220rpx;
	height: 220rpx;
	margin: 115rpx 265rpx 38rpx 265rpx;
}
.no-delivery-text{
	display: inline-block;
	width: 750rpx;
	font-size:28rpx;
	font-family:PingFang;
	font-weight:500;
	text-align: center;
	color:rgba(98,98,98,1);
}
</style>
