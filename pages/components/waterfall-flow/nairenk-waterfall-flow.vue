<template>
	<view class="flow-box" :style="'height: ' + loadingTop + 'px'">
		<view class="item" :class="left[index] == 1 ? 'left' : ''" :style="'top:' + top[index] + 'px;'" v-for="(item, index) in newList"
		 :key="index" :data-index="index" @click="choose">
			<view class="pic">
				<image class="image" mode="widthFix" :src="item.commodityImg[0]" style="width: 100%; display: block;"></image>
			</view>
			<view class="content">
				<text>{{item.commodityTitle}}</text>
				<!-- 			<view class="user">
					<image style="width: 40upx; height: 40upx; border-radius: 50%; margin-right: 10upx;" :src="item.user.avatar"></image>
					{{item.user.name}}
				</view> -->

				<view class="PriceArea">
					<text class="priceOrigin">￥</text>
					<text class="priceOriginValue">{{item.salePrice}}</text>
					<text class="priceCurrent">￥{{item.originalPrice}}</text>
				</view>
			</view>
		</view>
		<view class="loading" v-show="loading" :style="'top: ' + loadingTop + 'px'">
			<image src="/static/homepage/waterfall-flow/loading.gif" style="width: 80upx; height: 80upx;"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据列表
			list: {
				type: Array,
				default () {
					return []
				}
			},
			// 加载动画
			loading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				mark: 0,
				newList: [],
				boxHeight: [],
				top: [],
				left: [],
				loadingTop: 0,
			}
		},
		watch: {
			// 数据
			list: function(newVal, oldVal) {
				// 处理地区切换
				if (newVal.length === 0) {
					this.boxHeight = [];
					this.top = [];
					this.left = [];
					this.loadingTop = 0;
					this.mark = 0;
				} else {
					this.mark = oldVal.length;
				}

				if (newVal != oldVal) {
					this.newList = this.list;
					this.$nextTick(function() {
						setTimeout(() => {
							this.waterFall();
						}, 100)
					})
				}
			}
		},
		methods: {
			// 瀑布流定位
			waterFall() {
				const query = uni.createSelectorQuery().in(this);
				query.selectAll('.flow-box .item').boundingClientRect(res => {
					let len = this.newList.length;
					let height = 0;
					for (let i = this.mark; i < len; i++) {
						height = res[i].height;
						if (i < 2) {
							this.$set(this.newList[i], 'top', 0);
							this.$set(this.newList[i], 'left', i);
							this.boxHeight.push(height);
							this.top.push(0);
							this.left.push(i);
							// 商品数量较少时，也需要设置组件高度
							this.loadingTop = height;
						} else {
							let minHeight = this.boxHeight[0];
							let index = 0;
							if (minHeight > this.boxHeight[1]) {
								minHeight = this.boxHeight[1];
								index = 1;
							}
							this.boxHeight[index] = minHeight + height + 5;
							this.top.push(minHeight + 20);
							this.left.push(index);
							this.$set(this.newList[i], 'top', minHeight + 5);
							this.$set(this.newList[i], 'left', index);
							this.loadingTop = this.boxHeight[index];
						}
					}
				}).exec();
			},
			// 选中
			choose(e) {
				let index = e.currentTarget.dataset.index;
				this.$emit('click', this.newList[index]);
			}
		}
	}
</script>

<style scoped>
	.flow-box {
		font-size: 32rpx;
		font-weight: 500;
		color: #303133;
		position: relative;
		padding-bottom: var(--window-bottom);
		display: flex;
		justify-content: space-between;
	}

	.flow-box .item {
		border-radius: 10rpx;
		position: absolute;
		/* left: 10upx; */
		/* width: calc(50% - 20upx); */
		width: 47%;
		border: 1upx solid #f9f9f9;
		background: #fff;
	}

	.flow-box .left {
		left: 360upx;
	}

	.flow-box .pic {
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
		background: #f6f6f6;
	}

	.image {
		width: 100%;
		height: 316rpx;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
	}

	.flow-box .content {
		border-bottom-right-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		padding: 20upx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.title {
		font-size: 32rpx;
	}

	.PriceArea {
		/* margin-left: 10rpx; */
	}

	.priceOrigin {
		font-size: 24rpx;
		font-weight: 700;
		color: rgba(255, 126, 48, 1);
	}

	.priceOriginValue {
		font-size: 31rpx;
		font-weight: 700;
		color: rgba(255, 126, 48, 1);
	}

	.priceCurrent {
		margin-left: 17rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		text-decoration: line-through;
	}

	.flow-box .content text {
		width: 100%;
		margin-bottom: 20upx;
	}

	.flow-box .user {
		display: flex;
		width: 220upx;
		overflow: hidden;
		font-size: 26upx;
		color: #666;
	}

	.loading {
		position: absolute;
		width: 100%;
		text-align: center;
		padding: 20upx 0;
	}

	// 暂无商品样式
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
</style>
