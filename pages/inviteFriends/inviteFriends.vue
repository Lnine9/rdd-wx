<template>
	<view class="container">
		<canvas canvas-id="canvas-map" class="share-canvas">
			<!-- <image src="/static/inviteFriends/background.png" class="imageBackground"></image>
			<image class="QRCode" :src="QR"></image> -->
			
			<button class="save-btn" @click="createCanvasImageEvn">
				保存
			</button>
			
			<button class="btnimage" open-type="share">
				立即分享
				<text style="width: 17rpx;height: 17rpx;background-color: #FFFFFF;position: absolute;top: 15rpx;left: 20rpx;border-radius: 50%;"></text>
			</button>
			
			<!-- 分享弹窗-->
			<view class="share-pro">
				<view class="share-pro-mask" v-if="deliveryFlag"></view>
				<view class="share-pro-dialog" :class="deliveryFlag?'open':'close'">
					<view class="close-btn" @tap="closeShareEvn">
						<span class="font_family">&#xe6e6;</span>
					</view>
					<view class="share-pro-title">分享</view>
					<view class="share-pro-body">
						<view class="share-item">
							<button open-type="share" class="share-btn-common">
								<view class="font_family share-icon">&#xe6fa;</view>
								<view>分享给好友</view>
							</button>
						</view>
						<view class="share-item" @tap="createCanvasImageEvn">
							<view class="font_family share-icon">&#xe6f9;</view>
							<view>生成分享图片</view>
						</view>
					</view>
			
				</view>
			</view>
		</canvas>
		
	</view>
</template>

<script>
	import {
		api
	} from './api.js'
	import uniPopup from "../components/uni-popup/uni-popup.vue"
	export default {
		data() {
			return {
				QR: "",
				deliveryFlag: false,
				canvasFlag: true,
				width: '',
				height: ''
			};
		},
		components: {
			uniPopup
		},
		onShareAppMessage: function(res) {
			// 隐藏下方分享栏(如果下方有的话)
			this.deliveryFlag = false;
			if (res.from === 'button') {
				console.log('分享');
				console.log(res)
			}
			return {
				title: '快来跟我一起开宝盒哇',
				path: '/pages/index/index?scene=' + uni.getStorageSync('userId') || ''
			}
		},
		onLoad: function() {
			this.initConvasParams();
		},
		onReady() {
			uni.showLoading({
				title: '加载中'
			});
			
			api.getQR().then(res => {
				console.log('获取到的小程序码图片');
				console.log(res);

				this.QR = res.data.data;
				if (this.QR[4] != 's') {
					this.QR = 'https' + this.QR.substring(4, this.QR.length);
				}
				this.drawCode();
			}).catch(err => {
				console.log(err);
				uni.showToast({
					title: '小程序码获取失败',
					duration: 2000,
					icon: 'none'
				});
			})
		},
		methods: {
			// 初始化convas所需要的一些变量
			initConvasParams: function() {
				let phoneData = wx.getSystemInfoSync();
				this.phoneH = phoneData.windowHeight;
				this.phoneW = phoneData.windowWidth;
				let scaleW = this.phoneW / 375; //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
				let scaleH = this.phoneH / 667; //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
				const ctx = wx.createCanvasContext('canvas-map');
				
				// 绘制背景
				let bgImage = '/static/inviteFriends/background.png';
				ctx.drawImage(bgImage, 0, 0, this.phoneW, this.phoneH);
				ctx.draw(true);
				ctx.save();
			},
			// 绘制二维码
			drawCode: function() {
				let _this = this;

				const ctx = wx.createCanvasContext('canvas-map');
				// 绘制二维码
				wx.getImageInfo({
					src: this.QR,
					success(res) {
						ctx.drawImage(res.path, (_this.phoneW - 120) / 2 + 5, (_this.phoneH - 120) * 0.70, 120, 120);
						ctx.draw(true);
						uni.hideLoading();
					},
					fail() {
						uni.hideLoading();
						uni.showToast({
							title: '小程序码生成失败',
							duration: 2000,
							icon: 'none'
						});
					}
				});
				ctx.save();
				// //绘制分享按钮
				// this.roundRect(ctx, 80, 525, 210, 45, 25, '#ffb600', '#ffb600', 'btn')
				// ctx.restore();
				// ctx.setFontSize(14)
				// ctx.setFillStyle('#a1450c') //文字颜色：默认黑色
				// ctx.font = 'normal 34px ';
				// ctx.fillText('立即分享', (_this.phoneW - 58) / 2, 555, 68);
				// ctx.save();
			},
			// 保存到系统相册
			createCanvasImageEvn: function() {
				uni.showLoading({
					title: '保存中'
				})
				// 1-把画布转化成临时文件
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: this.phoneW, // 画布的宽
					height: this.phoneH, // 画布的高
					destWidth: this.phoneW * 5,
					destHeight: this.phoneH * 5,
					canvasId: 'canvas-map',
					success(res) {
						// 2-保存图片至相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res2) {
								uni.hideLoading();
								uni.showToast({
									title: '图片保存成功',
									duration: 2000
								})
							},
							fail() {
								console.log(res);
								uni.hideLoading();
								uni.showToast({
									title: '保存失败，稍后再试',
									duration: 2000,
									icon: 'none'
								})
							}
						})
					},
					fail(err) {
						console.log(err);
						uni.hideLoading();
						uni.showToast({
							title: '保存失败，稍后再试',
							duration: 2000,
							icon: 'none'
						})
					}
				})
			},
			// 画圆角矩形 ctx、x起点、y起点、w宽度、h高度、r圆角半径、fillColor填充颜色、strokeColor边框颜色
			roundRect: function(ctx, x, y, w, h, r, fillColor, strokeColor, btn) {
				// 开始绘制
				ctx.beginPath()
				// 绘制左上角圆弧 Math.PI = 180度
				// 圆心x起点、圆心y起点、半径、以3点钟方向顺时针旋转后确认的起始弧度、以3点钟方向顺时针旋转后确认的终止弧度
				ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
				// 绘制border-top
				// 移动起点位置 x终点、y终点
				ctx.moveTo(x + r, y)
				// 画一条线 x终点、y终点
				ctx.lineTo(x + w - r, y)
				// 绘制右上角圆弧
				ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
				// 绘制border-right
				ctx.lineTo(x + w, y + h - r)
				// 绘制右下角圆弧

				ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

				// 绘制左下角圆弧

				ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

				// 绘制border-left
				ctx.lineTo(x, y + r)
				if (btn == 'btn') {
					const grd = ctx.createLinearGradient(0, 0, 200, 0) //渐变色
					grd.addColorStop(0, fillColor)
					grd.addColorStop(1, strokeColor)
					// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
					ctx.setFillStyle(grd)
					// 对绘画区域填充
					ctx.fill()
				} else {

					if (fillColor) {
						// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
						ctx.setFillStyle(fillColor)
						// 对绘画区域填充
						ctx.fill()
					}
					if (strokeColor) {
						// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
						ctx.setStrokeStyle(strokeColor)
						// 画出当前路径的边框
						ctx.stroke()
					}
				}
				// 关闭一个路径
				ctx.closePath()
				// 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
				ctx.clip()
			},
			// 取消图片
			canvasCancel(val) {
				this.canvasFlag = val;
			},
			// 分享弹窗
			shareEvn() {
				console.log('展示分享按钮');
				this.deliveryFlag = true;
			},
			// 关闭分享弹窗
			closeShareEvn() {
				this.deliveryFlag = false;
			},
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
	}
	
	page {
		width: 100%;
		height: 100%;
	}

	.imageBackground {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.QRCode {
		width: 250rpx;
		height: 250rpx;
		position: absolute;
		bottom: 23%;
		left: 35%;
	}

	.btn {
		width: 469rpx;
		height: 124rpx;
		margin: -5rpx 0 0 -15rpx;
	}

	.save-btn {
		width: 150rpx;
		height: 60rpx;
		line-height: 60rpx;
		box-shadow: 1rpx 1rpx 5px #888888;
		background: #FFB600;
		border-radius: 30rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		font-size: 30rpx;
		color: #FFFFFF;
	}	

	.save-image-style {
		margin: 0 auto;
		width: 70rpx;
		height: 70rpx;
	}

	.save-image-txt {
		margin: 10rpx 25rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;
	}

	.btnimage {
		position: absolute;
		width: 440rpx;
		height: 95rpx;
		padding: 5rpx;
		background-color: #ffb600;
		border-radius: 62rpx;
		color: #a1450c;
		font-size: 35rpx;
		left: 160rpx;
		// top: 1050rpx;
		bottom: 4%;
	}

	.btnimage::after {
		border: none; //黑色边框去掉了
	}

	.circle {
		width: 10rpx;
		height: 10rpx;
		// border-radius: 50%;
		background-color: #FFFFFF;
	}

	.save {
		font-size: 24rpx;
		color: #a1450c;
		margin-left: 300rpx;
	}

	.share-canvas {
		display: flex;
		justify-content: space-between;
		// top: 0 !important;
		// left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
	}
	
	// 底部分享弹窗
	/*每个页面公共css 放app.vue页面的 */
	@font-face {
		font-family: 'font_family';
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot');
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff') format('woff'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family') format('svg');
	}
	
	.font_family {
		font-family: "font_family" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	
	/* 按钮去掉边框 */
	.share-btn-common::after {
		border: none;
	}
	
	.share-btn-common {
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: 1;
		color: #1c1c1c;
		font-size: 28rpx;
		background: none;
	}
	
	.button-hover {
		color: #1c1c1c;
		background: none;
	}
	
	/*每个页面公共css */
	.content {
		text-align: center;
		height: 100%;
	}
	
	/* .share-btn {
		padding: 30upx 60upx;
		background-color: $uni-btn-color;
		color: $uni-text-color-inverse;
	} */
	
	.share-pro {
		position: absolute;
		// display: flex;
		// align-items: center;
		// justify-content: flex-end;
		// flex-direction: column;
		line-height: 1;
		box-sizing: border-box;
	
		.share-pro-mask {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.5);
		}
	
		.share-pro-dialog {
			width: 750rpx;
			height: 310rpx;
			overflow: hidden;
			background-color: #fff;
			border-radius: 24rpx 24rpx 0px 0px;
			// position: relative;
			box-sizing: border-box;
			position: fixed;
			bottom: 0;
	
			.close-btn {
				padding: 20rpx 15rpx;
				position: absolute;
				top: 0rpx;
				right: 29rpx;
			}
	
			.share-pro-title {
				font-size: 28rpx;
				color: #1c1c1c;
				padding: 28rpx 41rpx;
				background-color: #f7f7f7;
			}
	
			.share-pro-body {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				font-size: 28rpx;
				color: #1c1c1c;
	
				.share-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					justify-content: space-around;
	
					.share-icon {
						text-align: center;
						font-size: 70rpx;
						margin-top: 39rpx;
						margin-bottom: 16rpx;
						color: #42ae3c;
					}
	
					&:nth-child(2) {
						.share-icon {
							color: #ff5f33;
						}
					}
				}
			}
		}
	
		/* 显示或关闭内容时动画 */
	
		.open {
			transition: all 0.3s ease-out;
			transform: translateY(0);
		}
	
		.close {
			transition: all 0.3s ease-out;
			transform: translateY(310rpx);
		}
	
	}
</style>
