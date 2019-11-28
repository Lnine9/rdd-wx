<template>
	<view>
		<view 
			v-for="item in imageUrl"
			:key="item"
			class="image-show">
			<image :src="item" mode="" style="width: 100%;height: 100%;"></image>
		</view>
		
		<button type="primary" @tap="loadImage" style="margin-top: 20rpx;">加载图片</button>
	</view>
</template>

<script>
	import {ImageStorage} from '../imageStorage.js'
	
	export default {
		data() {
			return {
				imageUrl: []
			}
		},
		methods: {
			loadImage: function() {
				if (this.imageUrl == null || this.imageUrl === undefined) {
					this.imageUrl = [];
				}
				
				ImageStorage.image_cache('http://39.108.134.245/Image/WaterSeee.png', 'WaterSeee', () => {
					this.imageUrl.push('http://39.108.134.245/Image/WaterSeee.png');
				});
			}
		}
	}
</script>

<style>
	.image-show {
		margin-top: 20rpx;
		width: 100%;
		height: 500rpx;
	}
</style>
