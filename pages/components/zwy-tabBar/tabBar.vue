<template>
	<view class="tabBar">
		<view
		 v-for="(item, index) in tabBar"
		 :key="index"
		 class="tabbar_item"
		 :class="{'active':item.url == currentPage}"
		 @click="navTo(item)"
		 >	<view style="display: flex;flex-direction: column;align-items: center;">
			<image v-if="item.url == currentPage" :src="item.imgNormal"></image>
			<image v-if="item.url != currentPage" :src="item.imgClick"></image>
			<view class="text">{{item.text}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {api} from	'./api.js'
	export default {
		props:['currentPage'],
		data() {
			return {
				tabBar:[{
					imgClick:"/static/homePageNo.png",
					imgNormal: "/static/homePage.png",
					text: "首页",
					url: "homePage"
				},
				{
					imgClick: "/static/mine.png",
					imgNormal: "/static/mine_cilck.png",
					text: "我的",
					url: "mine"
				}],
				loginState:'',
				isShop:''
			};
		},
		mounted() {
			uni.hideTabBar({});
			// if(this.loginState==true&&this.isShop==1){
			// 	this.tabBar=[{
			// 		imgClick:"/static/homePageNo.png",
			// 		imgNormal: "/static/homePage.png",
			// 		text: "首页",
			// 		url: "homePage"
			// 	},
			// 	{
			// 		imgClick: "/static/mine.png",
			// 		imgNormal: "/static/mine_cilck.png",
			// 		text: "我的",
			// 		url: "mine"
			// 	},
			// 	{
			// 		imgClick: "/static/order_noclick.png",
			// 		imgNormal: "/static/order_click.png",
			// 		text: "订单中心",
			// 		url: "shopOrder"
			// 	}]
			// }
		},
		computed:{

		},
		created() {
			this.judgeScan();
			let token = uni.getStorageSync('token');
			this.loginState = uni.getStorageSync('loginState');
			
			if(this.loginState==true && token!=null){
				api.getTabBarInfo().then(res => {
					console.log(res);
					if (res.data.code === 200) {
						this.tabBar = res.data.data
					}
				}).catch(err => {
					console.log(err)
				})
			}
		},
		methods:{
			//判断是否为商家
			judgeScan(){
				let value = uni.getStorageSync('roleNameList');
				console.log(value)
				if(value != null ){
					for (var i = 0; i < value.length; i++) {
						if(value[i].roleName === "微信商家"){
							this.isShop = 1;
						}else{
							this.isShop = 0
						}
					}
				}else{
					this.isShop = 0
				}
				console.log('商家'+this.isShop)
			},
			navTo(item){
				if(item.url !== this.currentPage){
					var isUrl = `/pages/${item.url}/${item.url}`
					const that = this
					uni.switchTab({
						url: isUrl
					})
				} else{
					this.$parent.toTop()
				}
			}
		}

	}
</script>


<style lang="scss" scoped>
	//导航栏设置
		$isRadius:20upx; //左上右上圆角
		$isWidth:100vw; //导航栏宽度
		$isBorder:3px solid white; //边框 不需要则设为0px
		$isBg:#ffffff; //背景

	// 选中设置
		$chooseTextColor:#333333; //选中时字体颜色
		$chooseBgColor:white; //选中时背景颜色 transparent为透明

	//未选中设置
		$normalTextColor:#999; //未选中颜色
	.tabBar{
		width: $isWidth;
		height: 100upx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin:0 auto;
		z-index: 998;
		background-color: $isBg;
		color: $normalTextColor;
		border-left: $isBorder;
		border-top: $isBorder;
		border-right: $isBorder;
		display: flex;
		justify-content: space-around;
		border-top-right-radius: $isRadius;
		border-top-left-radius: $isRadius;
		box-sizing: border-box;
		overflow: hidden;
		.tabbar_item{
			width: 20%;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			&.active{
				background: $chooseBgColor;
				color: $chooseTextColor;
			}
		}
		image{
			width: 50rpx;
			height:54rpx;
		}
	}
</style>
