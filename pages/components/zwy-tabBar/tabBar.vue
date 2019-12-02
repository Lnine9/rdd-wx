<template>
	<view class="tabBar">
		<view
		 v-for="(item, index) in tabBar" 
		 :key="item.url" 
		 class="tabbar_item" 
		 :class="{'active':item.url == currentPage}"
		 @click="navTo(item)"
		 >
			<image v-if="item.url == currentPage" :src="item.imgNormal"></image>
			<image v-else :src="item.imgClick"></image>
			<view class="text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	import {api} from	'./api.js'
	export default {
		props:['currentPage'],
		data() {
			return {
				tabBar:[]
			};
		},
		created() {
			uni.hideTabBar({})
			api.getTabBarInfo().then(res=>{
				this.tabBar=res.data.data;
			}).catch(err=>{
				console.log(err)
			})
		},
		computed:{
			
		},
		methods:{
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
		$chooseTextColor:#50B7EA; //选中时字体颜色
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
			width: 25%;
			font-size: 12px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			&.active{
				border-left: $isBorder;
				border-top: $isBorder;
				background: $chooseBgColor;
				color: $chooseTextColor;
			}
		}
		image{
			width: 48upx;
			height:48upx;
			margin-left: 5upx;
		}
	}
</style>
