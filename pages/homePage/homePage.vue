<template>
	<view class="container">
		<view class="header_text"><label>首页</label>
		<picker class="head_region" :range="regionList" :value="regionIndex">
			<view >{{regionList[regionIndex]}}</view>
		</picker>
		</view>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			
			<swiper class="carousel" circular @change="swiperChange">
				<swiper-item :indicator-dots="indicatorDots" v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToDetailPage({title: '轮播广告'})">
					<image :src="item.src" />
				</swiper-item>
			</swiper>

		</view>
		
		<!-- 精选商品 -->
		<view class="selected_commodities">
			<view class="selected_commodities_text"><label>精选商品</label></view>
		</view>
		
	</view>
</template>

<script>
	import {api} from './api.js'
	export default{
		data() {
			return{
				regionList:['重庆','南京'],
				regionIndex: 0,
				carouselList: [ {src:'http://czb-file.oss-cn-zhangjiakou.aliyuncs.com/946554737883721687%E9%83%91%E9%87%8D%E5%A3%B0%E6%98%8E%E6%BB%9A%E5%8A%A8%E5%9B%BE.jpg?Expires=4727777009&OSSAccessKeyId=LTAIjqFIGExMo9vx&Signature=1ZInzWIENYYwr9MX4yF/jAhr1pg%3D'}],
				indicatorDots: true
			}
		},
		methods:{
			getCarouselPic() {
			},
			onReady() {
				this.getCarouselPic()
			}
		}
	}
</script>

<style>
	/* 头部文字 */
	.header_text {
		margin: 0 auto;
		width: 80%;
		height: 50px;
		line-height: 50px;
	}
	.head_region {
		float: right;
	}
	.carousel-section {
		width: 80%;
		margin: 0 auto;
	}
	.selected-commodities {
		
	}
	.selected_commodities_text {
		width: 80%;
		margin: 20px auto;
	}
	
	
</style>
