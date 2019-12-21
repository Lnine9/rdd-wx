<template>
	<view>
		<canvas canvas-id="canvas-map" class="share-canvas">
			<!-- <image src="/static/inviteFriends/background.png" class="imageBackground"></image>
			<image class="QRCode" :src="QR"></image> -->
			
			<button class="btnimage" open-type='share'>
				立即分享
				<text style="width: 17rpx;height: 17rpx;background-color: #FFFFFF;position: absolute;top: 15rpx;left: 20rpx;border-radius: 50%;"></text>
			</button>
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
				posterData: {},
				width: '',
				height: ''
			};
		},
		components: {
			uniPopup
		},
		onShareAppMessage: function(res) {
			console.log('-------------');
			// 分享的同时保存图片
			this.saveCanvasImage();

			if (res.from === 'button') {
				console.log('分享');
				console.log(res)
			}
			return {
				title: '快来跟我一起开宝盒哇',
				path: '/pages/index/index?scene=' + uni.getStorageSync('userId') || ''
			}
		},
		onReady() {
			uni.showLoading({
				title: '加载中'
			});
			this.initConvasParams();
			api.getQR().then(res => {
				console.log('获取到的小程序码图片');
				console.log(res);
				uni.hideLoading()

				this.QR = res.data.data;
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
				//将网络图片转成本地路径 商品图片
				//覆盖绘制
				//问题：在微信小程序使用canvas绘制圆角图片时，微信调试工具正常显示，android真机都不显示。
				// 原因：因为ctx.clip()剪切区域使用的填充颜色是透明的，所以图片没出来。
				// 解决方案：将剪切区域设置成实体颜色就好了。
				//绘制图
				// 绘制二维码
				wx.getImageInfo({
					src: this.QR,
					success(res) {
						ctx.drawImage(res.path, (_this.phoneW - 120) / 2 + 5, (_this.phoneH - 120) * 0.70, 120, 120);
						ctx.draw(true);
					},
					fail() {
						uni.showToast({
							title: '小程序码生成失败',
							duration: 2000,
							icon: 'none'
						});
					}
				});
				
				//绘制分享按钮
				ctx.save();
				this.roundRect(ctx, 80, 525, 210, 45, 25, '#ffb600', '#ffb600', 'btn')
				ctx.restore();
				ctx.setFontSize(14)
				ctx.setFillStyle('#a1450c') //文字颜色：默认黑色
				ctx.font = 'normal 34px ';
				ctx.fillText('立即分享', (_this.phoneW - 58) / 2, 555, 68);
				ctx.save();
			},
			// 保存到系统相册
			saveCanvasImage: function() {
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
								// wx.hideLoading();
								// uni.showToast({
								// 	title: '图片保存成功，可以去分享啦~',
								// 	duration: 2000
								// })
							},
							fail() {
								// uni.showToast({
								// 	title: '保存失败，稍后再试',
								// 	duration: 2000,
								// 	icon: 'none'
								// })
								// wx.hideLoading();
							}
						})
					},
					fail() {
						// uni.showToast({
						// 	title: '保存失败，稍后再试',
						// 	duration: 2000,
						// 	icon: 'none'
						// })
						// wx.hideLoading();
					}
				})
				// 保存图片至相册
				uni.saveImageToPhotosAlbum({
					filePath: "pages/inviteFriends/inviteFriends",
					success(res) {
						console.log('图片保存成功');
						console.log(res);
					},
					fail(err) {
						console.log('图片保存失败');
						console.log(err);
					}
				});
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
			}
		}
	}
</script>

<style lang="scss">
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

	.btnimage {
		width: 440rpx;
		height: 95rpx;
		padding: 5rpx;
		background-color: #ffb600;
		border-radius: 62rpx;
		color: #a1450c;
		font-size: 35rpx;
		position: fixed;
		left: 160rpx;
		top: 1050rpx;
		// bottom: 4%;
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
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}
</style>
