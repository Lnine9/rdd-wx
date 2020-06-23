<template>
	<movable-area v-bind:style="noDataCenter" v-if="showPage" class="container">
		<view v-if="!showPage" class="nodataText">
			<image src="/static/myOrder/myOrderNoData.png" class="noDataPic"></image>
			<text>暂无数据</text>
		</view>
		<view class="carousel">
			<swiper interval="2000" autoplay indicator-dots indicator-color="rgba(255,255,255,0.3))" indicator-active-color="rgba(255,255,255,1)"
			 circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in titleImg" :key="index">
					<view @click="checkPicture(titleImg ,index)" class="image-wrapper">
						<image :src="item" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{dataDic.commodityTitle}}</text>
			<view class="price-box">
				<view style="display: block;">
					<text class="price">{{"￥" + dataDic.salePrice}}</text>
					<text class="m-price">{{"￥" + dataDic.originalPrice}}</text>
				</view>
				<view style="color: #999999;font-weight: 400;font-size: 26rpx;">
					<text style="margin-right: 40rpx;">销量: {{dataDic.salesVolume}}</text>
					<text style="display: inline-block;">库存: {{dataDic.commodityNum}}</text>
				</view>
			</view>

		</view>
		<view class="c-list">
			<view class="c-row b-b" @click="navToShop">
				<view class="con-list">
					<image style="width: 30rpx;height: 34rpx;margin-top: auto;margin-bottom: auto;margin-right: 20rpx;" src="/static/product/location.png"></image>

					<view class="shop-container">
						<view class="shop-info-container">
							<text style="font-size:28rpx;font-weight:500;color:rgba(51,51,51,1);">{{dataDic.shopName}}</text>
							<text class="address-txt">{{dataDic.shopAddress}}</text>
						</view>

						<view class="nav-text-style">
							地图/导航 >
						</view>
					</view>

				</view>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list" style="font-size:24rpx;font-family:PingFang SC;font-weight:400;color:rgba(153,153,153,1);">
					<template><text>{{dataDic.commodityInfo}}</text></template>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<view class="line">
				</view>
				<text>商品介绍</text>
			</view>
			<rich-text style="width: 100%;" :nodes="bottomImg"></rich-text>
		</view>
		<view class="bottom" v-if="!deliveryFlag">
			<view @click="makeCall()" class="buyView" style="background-color: #FFFFFF;">
				<image style="width: 31rpx;height: 30rpx;margin-right: 10rpx;" src="../../static/product/server.png"></image>
				<text style="color:rgba(51,51,51,1);font-size: 28rpx;">联系客服</text>
			</view>
			<button open-type="getUserInfo" lang="zh_CN" @getuserinfo="reayToBuy()" class="buyView">
				<text>立即购买</text>
			</button>
		</view>

		<!-- 商品属性选择 -->
		<view v-show="isBuy" catchtouchmove="catchTouch" @click="closeAttrChoose" style="background-color: rgba(0,0,0,0.5); z-index: 3;position: fixed;bottom: 0rpx;right: 0rpx;width: 100vw;height: 100vh;"></view>
		<view v-show="isBuy" :class="isBuy?'open-ready-to-buy':'close-ready-to-buy'" class="cart-item" @click.stop="">
			<view class="commodity-info-container">
				<view class="commodity-info-image">
					<image :src="showSaleImageUrl" @click="checkPicture([showSaleImageUrl], 0)" style="width: 210rpx;height: 210rpx;"></image>
				</view>
				<view class="item-right">
					<view style="display: flex;justify-content: space-between;align-items: center;">
						<text class="item-right-title">
							{{dataDic.commodityTitle}}
						</text>
						<text class="cancel-txt" @click="cancel">取消</text>
					</view>
					<view class="selected-attr-container">
						<text class="selected-attr-txt">{{selectedAttr}}</text>
					</view>
					
					<view class="selected-attr-container" v-if="dataDic.idLimitedNum !== 0">
						<text class="selected-attr-txt" style="color: #333333;">商品限购:{{dataDic.idLimitedNum}}件</text>
					</view>

					<view class="price-container">
						<text class="small-price-txt">¥</text>
						<text class="big-price-txt">{{showSalePrice}}</text>
					</view>
				</view>
			</view>

			<view class="commodity-attr-list-container">
				<view class="commodity-attr-container" v-for="(attrValueObj, attrIndex) in attrValueList" :key="attrIndex">
					<view class="commodity-attr-name">{{attrValueObj.name}}</view>

					<view class="commodity-attr-value-container">
						<view class="commodity-attr-value" :class="(value.content === attrValueObj.selectedValue)? 'commodity-attr-value-active': 'commodity-attr-value-disabled'"
						 v-for="(value, valueIndex) in attrValueObj.contentList" :key="valueIndex" :data-value="value" @tap="selectAttrValue">
							{{value.content}}
						</view>
					</view>
				</view>
			</view>

			<view class="purchase-number-container">
				<view class="commodity-attr-name" style="margin-right: 50rpx;">购买数量<span v-if="dataDic.limitedNum!=0" style="font-size: 25rpx;">(限购{{dataDic.limitedNum}}件)</span></view>
				<uniNumberBox :min="1" :max="dataDic.commodityNum" :value="buyNum>dataDic.commodityNum?dataDic.commodityNum:buyNum"
				 @change="numberChange()" v-if="dataDic.limitedNum==0"></uniNumberBox>
				 <uniNumberBox :min="1" :max="dataDic.limitedNum" :value="buyNum>dataDic.commodityNum?dataDic.commodityNum:buyNum"
				  @change="numberChange()" v-else  style="margin-left: -20px;"></uniNumberBox>
				<button class="buyButton" @click="buy()">立即购买</button>
			</view>
		</view>

		<!-- 右下侧分享返佣 -->
		<!-- 拖拽功能 -->
		<movable-view direction="all" x="544" y="300" :animation="false" class="rebate-container" v-show="rebateShow">
			<button class="rebate-img-container" open-type="getUserInfo" lang="zh_CN" @getuserinfo="shareEvn()">
				<image src="/static/product/ic-rebate-red-wallet.png" mode="" class="rebate-img"></image>

				<text class="rebate-text">赚￥{{rebateValue}}</text>
			</button>

			<image src="/static/product/ic-close.png" mode="" class="rebate-close" @tap="closeRebate()"></image>
		</movable-view>

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
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData" />
		<view :hidden="canvasFlag" catchtouchmove="catchTouch">
			<!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas" canvas-id="myCanvas"></canvas><!-- 海报 -->
		</view>

		<!-- 通过分享链接进入，未登录用户出现的弹窗 -->
		<view v-if="loginTipShow" class="login-tip" catchtouchmove="catchTouch">
			<view class="login-tip-bg">
				<view class="login-tip-container">
					<text class="login-tip-title">提示</text>
					<text class="login-tip-content">检测到您目前未登录，是否立即登录？</text>

					<view class="login-tip-btn-container">
						<button class="login-tip-button-cancel" @click="close()">取消</button>
						<button class="login-tip-button-update" open-type="getUserInfo" lang="zh_CN" @getuserinfo="loginUpdate()">确定</button>
					</view>
				</view>
			</view>
		</view>
		<!-- <uni-loginPopUp ref="loginPopUp"></uni-loginPopUp> -->
	</movable-area>
</template>

<script>
	import uniNumberBox from '../components/uni-number-box/uni-number-box.vue'
	import loginPopup from "../components/uni-loginPopUp/uni-loginPopUp.vue"
	// 海报
	import hchPoster from '../components/hch-poster/hch-poster.vue'

	import {
		api
	} from "./api.js"

	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				showPage: false,
				buyNum: 1,
				isBuy: false,
				dataDic: {}, // 商品信息
				attrValueList: [], // 商品属性列表
				commodityImg: [],
				specClass: 'none',
				titleImg: [],
				shareList: [],
				bottomImg: [],
				imgList: [],
				// 通过各种形式推荐该用户进入该页面的推荐人(上级)
				superiorUser: '',
				commodityId: '', // 当前商品页的商品id
				// 右侧分享返佣
				rebateValue: 0,
				rebateShow: false,
				// 分享海报的使用的变量
				deliveryFlag: false,
				canvasFlag: true,
				posterData: {},
				shareLogin: false, // 分享登录标识
				buyLogin: false, // 购买登录标识

				loginTipShow: false, // 提示要求用户登陆的弹窗
				showSaleImageUrl: '', // 用户准备购买时展示的商品图片

				code: '', // 商品分享二维码
			};
		},
		components: {
			uniNumberBox,
			hchPoster,
			'uni-loginPopUp': loginPopup
		},
		computed: {
			noDataCenter() {
				let result = '';
				if (!this.showPage) {
					result += "text-align:center;"
				}
				return result;
			},
			// 当前选中的属性，展示的文字
			selectedAttr() {
				if (this.attrValueList == undefined || this.attrValueList == null || this.attrValueList.length === 0) {
					return '';
				}
				let str = '当前选择：';
				for (let attrValueObj of this.attrValueList) {
					if (attrValueObj.selectedValue !== '') {
						str += '"' + attrValueObj.selectedValue + '" ';
					}
				}
				return str.slice(0, str.length - 1);
			},
			// 购买时展示的价格
			showSalePrice() {
				// 因为选项产生的附加价格
				let extraPrice = 0;
				for (let attrValueObj of this.attrValueList) {
					if (attrValueObj.selectedValue !== '') {
						for (let value of attrValueObj.contentList) {
							if (value.content === attrValueObj.selectedValue) {
								extraPrice += Number(value.extraSaleMoney);
								break;
							}
						}
					}
				}
				// 计算单价
				let singlePrice = this.dataDic.salePrice + extraPrice;

				let price = this.buyNum * singlePrice;
				let str = new String(this.buyNum * singlePrice);

				if (str.indexOf('.') != -1) {
					// 如果有小数点，保留两位小数
					price = price.toFixed(2);
				} else {
					// 没有小数点，不保留小数
					price = price.toFixed(0);
				}

				return price;
			},
			...mapState(['token'])
		},
		methods: {
			// 商品加载完成的回调
			commodityImageLoad: function () {

			},
			// 选中属性
			selectAttrValue: function(item) {
				let chooseValue = item.currentTarget.dataset.value;
				// 设置选中属性，并通过绑定修改样式
				for (let attrValueObj of this.attrValueList) {
					if (attrValueObj.name === chooseValue.name) {

						attrValueObj.selectedValue = chooseValue.content;
						// 根据当前选中的属性，选择是否要加载新的图片
						for (let value of attrValueObj.contentList) {
							if (value.content === chooseValue.content && value.savePath !== undefined && value.savePath != null) {
								this.showSaleImageUrl = value.savePath;
							}
						}
						break;
					}
				}
			},
			// 选择商品属性时，上方灰色部分，回到商品页面
			closeAttrChoose: function() {
				this.isBuy = false;
			},
			// 滑动穿透解决
			catchTouch: function() {
				return;
			},
			// 地图导航
			navToShop: function() {
				wx.openLocation({
					latitude: new Number(this.dataDic.latitude),
					longitude: new Number(this.dataDic.longitude),
					name: this.dataDic.shopName,
					address: this.dataDic.shopAddress,
					scale: 18
				});
			},
			createCanvasImageEvn() {
				wx.showLoading({
					title: '正在生成海报'
				});

				let startTime = (new Date()).valueOf();
				// 如果没有获取到二维码图片，重新获取
				if (this.code === '') {
					api.getQRCodeImg({
						commodityId: this.commodityId
					}).then((res) => {
						let endTime = (new Date()).valueOf();
						this.code = res.data.data;
						// http -> https
						if (this.code[4] != 's') {
							this.code = 'https' + this.code.substring(4, this.code.length);
						}
						console.log('异常方式获取二维码图片');
						console.log('异常获取二维码:' + (endTime - startTime));
						Object.assign(this.posterData, {
							url: this.dataDic.posterImg, //商品海报图片
							icon: 'none', //优惠价图标
							title: this.dataDic.commodityTitle + ' ' + this.dataDic.commodityInfo.split(" ").join(""), //标题
							discountPrice: this.dataDic.salePrice, //折后价格
							orignPrice: this.dataDic.originalPrice, //原价
							code: this.code, //商品二维码
						});
						this.$forceUpdate(); //强制渲染数据
						setTimeout(() => {
							this.canvasFlag = false; //显示canvas海报
							this.deliveryFlag = false; //关闭分享弹窗
							this.$refs.hchPoster.createCanvasImage(); //调用子组件的方法
						}, 500);
					}).catch(err => {
						console.log(err);
					});
					return;
				}

				Object.assign(this.posterData, {
					url: this.dataDic.posterImg, //商品海报图片
					icon: 'none', //优惠价图标
					title: this.dataDic.commodityTitle + ' ' + this.dataDic.commodityInfo.split(" ").join(""), //标题
					discountPrice: this.dataDic.salePrice, //折后价格
					orignPrice: this.dataDic.originalPrice, //原价
					code: this.code, //商品二维码
				});
				this.$forceUpdate(); //强制渲染数据
				setTimeout(() => {
					this.canvasFlag = false; //显示canvas海报
					this.deliveryFlag = false; //关闭分享弹窗
					this.$refs.hchPoster.createCanvasImage(); //调用子组件的方法
				}, 500);
				// 以下是根据后端接口动态生成小程序码 end
			},
			// 分享弹窗
			shareEvn() {
				this.buyLogin = false;
				this.shareLogin = true;
				let loginState = uni.getStorageSync("loginState");
				if (loginState == true) {
					this.deliveryFlag = true;
				} else {
					this.wxGetUserInfo();
					// this.$refs.loginPopUp.open();
				}
			},
			// 关闭分享弹窗
			closeShareEvn() {
				this.deliveryFlag = false;
			},
			// 取消海报
			canvasCancel(val) {
				this.canvasFlag = val;
			},
			/**
			 * 获取商品详细信息
			 * @param {Object} commodityId
			 */
			numberChange: function(data) {

				this.buyNum = data;

			},
			cancel: function() {
				this.isBuy = false
			},
			// 登录提示窗关闭按钮
			close: function() {
				this.loginTipShow = false;
			},
			// 登录提示窗确定按钮
			loginUpdate: function() {
				this.loginTipShow = false;

				this.wxGetUserInfo();
			},
			getData: function(commodityId) {
				uni.showLoading({
					title: "正在加载"
				})
				api.getList({
					commodityId: commodityId
				}).then(res => {
					console.log('商品信息');
					console.log(res);
					// 设置商品信息
					this.dataDic = res.data.data;
					this.dataDic.commodityNum = Number.parseInt(this.dataDic.commodityNum);
					this.dataDic.salePrice = Number.parseFloat(this.dataDic.salePrice);
					this.dataDic.limitedNum = Number.parseInt(this.dataDic.limitedNum);
					this.dataDic.idLimitedNum = Number.parseInt(this.dataDic.idLimitedNum);
					// 海报图片数据path处理
					console.log('商品海报图片');
					console.log(this.dataDic.posterImg);
					if (this.dataDic.posterImg != undefined && this.dataDic.posterImg != null && this.dataDic.posterImg[4] != 's') {
						this.dataDic.posterImg = 'https' + this.dataDic.posterImg.substring(4, this.dataDic.posterImg.length);
					}

					console.log('商品图片');
					console.log(this.dataDic.commodityImg[0]);

					// 设置商品属性
					this.attrValueList = res.data.data.attrs;
					if (this.attrValueList == undefined || this.attrValueList == null) {
						this.attrValueList = [];
					} else {
						// 初始化返回值，vue双向绑定机制
						for (let i = 0; i < res.data.data.attrs.length; i++) {
							this.$set(res.data.data.attrs[i], 'selectedValue', '');
						}
						// 该属性只有一种时，默认选中
						for (let i = 0; i < this.attrValueList.length; i++) {
							if (this.attrValueList[i].contentList.length === 1) {
								this.attrValueList[i].selectedValue = this.attrValueList[i].contentList[0].content;
							}
						}
					}

					this.titleImg = this.dataDic.commodityImg;
					this.bottomImg = this.dataDic.commodityIntroduce;
					// let bottomPicture = this.dataDic.guessImgs;
					// this.bottomImg += `<div style="width:100%">`
					// bottomPicture.forEach((item, index, arr) => { // item为arr的元素，index为下标，arr原数组
					// 	if (index >= 3) {
					// 		this.bottomImg += `<img style="width:100%;display:block;" src="${item}"/>`
					// 	}
					// });
					// this.bottomImg += `</div>`

					this.commodityImg = this.dataDic.commodityImg
					uni.hideLoading();
					this.showPage = true;

					// 返佣红包显示与隐藏问题
					if (this.dataDic.fyMoney != undefined && this.dataDic.fyMoney != null && this.dataDic.fyMoney !== '') {
						// this.rebateShow = true;
						// 返佣金额为0，隐藏
						if (this.dataDic.fyMoney == 0) {
							this.rebateShow = false;
						}
						this.rebateValue = this.dataDic.fyMoney;
					} else {
						// 如果没有返佣金额，则不显示返佣红包
						this.rebateShow = false;
					}
				}).catch(err => {
					console.log('获取商品信息失败');
					console.log(err);
					uni.hideLoading()
					uni.showToast({
						title: "网络错误，请稍后重试",
						icon: 'none'
					})
				})
			},
			// 放大查看图片
			checkPicture: function(url, index) {
				uni.previewImage({
					current: index,
					urls: url,
					indicator: "default",
					loop: true,

					// longPressActions: {
					//     itemList: ['发送给朋友', '保存图片', '收藏'],
					//     success: function(data) {
					//         console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					//     },
					//     fail: function(err) {
					//         console.log(err.errMsg);
					//     }
					// }
				});
			},
			makeCall: function() {
				// uni.makePhoneCall({
				// 	// 手机号
				// 	phoneNumber: this.dataDic.shopPhone,
				// 	success: (res) => {
				// 		console.log('调用成功!')
				// 	},
				// 	fail: (res) => {
				// 		console.log('调用失败!')
				// 	}
				// });

				uni.showModal({
					title: '提示',
					content: '请添加囧途宝盒客服微信咨询\n微信号：cqrdd2019',
					showCancel: false
				})
			},
			reayToBuy: function() {
				this.showSaleImageUrl = this.titleImg[0];
				this.buyLogin = true;
				this.shareLogin = false;
				let loginState = uni.getStorageSync("loginState");
				if (loginState == true) {
					this.isBuy = true
				} else {
					this.wxGetUserInfo();
					// this.$refs.loginPopUp.open();
				}
			},

			buy: function() {
				if(this.buyNum > 2){
					uni.showToast({
						title: '商品一次性购买不能超过2个',
						icon: 'none',
					});
					return;
				}
				// 存储当前选择的属性id
				let selectedValueId = '';
				// 属性选择验证
				for (let attrValueObj of this.attrValueList) {
					if (attrValueObj.selectedValue === '') {
						uni.showToast({
							title: '请选择' + attrValueObj.name,
							icon: 'none',
						});

						return;
					}

					for (let value of attrValueObj.contentList) {
						if (attrValueObj.selectedValue === value.content) {
							selectedValueId += value.commodityAttrId + ",";
						}
					}
				}
				// 去除末尾逗号
				if (selectedValueId != null && selectedValueId != '') {
					selectedValueId = selectedValueId.slice(0, selectedValueId.length - 1);
				}
				console.log('传递商品图片');
				console.log(this.showSaleImageUrl);
				let imageUrl = encodeURIComponent(this.showSaleImageUrl);
				console.log(imageUrl);
				uni.navigateTo({
					url: `/pages/payOrder/payOrder?commodityId=${this.dataDic.commodityId}&commodityNum=${this.buyNum}&selectedValueId=${selectedValueId}&selectedAttr=${this.selectedAttr}&showSalePrice=${this.showSalePrice}&imageUrl=${imageUrl}`
				})
			},
			...mapMutations(['login']),
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo: function() {
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						_this.nickName = nickName;
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						_this.avatarUrl = avatarUrl;
						uni.base
						try {
							uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
							_this.loginWx();
						} catch (e) {
							console.error(e)
						}
					},
					fail(res) {
						uni.showModal({
							content: '获取用户信息失败',
							showCancel: true
						});
					}
				});
			},
			//登录
			loginWx: function() {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						if (!_this.isCanUse) {
							//非第一次授权获取用户信息
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									//获取用户信息后向调用信息更新方法
									let nickName = infoRes.userInfo.nickName; //昵称
									_this.nickName = nickName;
									let avatarUrl = infoRes.userInfo.avatarUrl; //头像
									_this.avatarUrl = avatarUrl;
								}
							});
						}
						//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						let loginParam = {
							code: loginRes.code,
							nickName: _this.nickName,
							avatarUrl: _this.avatarUrl,
							// superiorUser: _this.superiorUser
							superiorUser: uni.getStorageSync('superiorUser') || null
						}
						api.getData(loginParam).then(res => {
							_this.loginSuccess(res.data.token)
						}).catch(err => {
							console.log(err)
						})
					},
				});
			},
			//登录成功后跳转到首页
			loginSuccess: function(data) {
				this.login(data);
				uni.setStorageSync('loginState', true);
				uni.hideLoading();

				// 根据标识，继续之后的操作
				if (this.buyLogin && !this.shareLogin) {
					this.isBuy = true
				} else if (this.shareLogin = true && !this.buyLogin) {
					this.deliveryFlag = true;
				}
			},

			// 关闭分享返佣的图片
			closeRebate: function() {
				this.rebateShow = false;
			},
			// 获取二维码图片
			getHchImage: function() {
				let startTime = (new Date()).valueOf();
				api.getQRCodeImg({
					commodityId: this.commodityId
				}).then((res) => {
					let endTime = (new Date()).valueOf();
					this.code = res.data.data;
					console.log('正常获取二维码');
					console.log(this.code);
					console.log('正常获取二维码:' + (endTime - startTime));
					// http -> https
					if (this.code != undefined && this.code != null && this.code[4] != 's') {
						this.code = 'https' + this.code.substring(4, this.code.length);
					}
				}).catch(err => {
					console.log(err);
				})
			}
		},
		onLoad: function(params) {
			console.log('商品id');
			console.log(params.id);
			// 判断该用户是否是vip
			let isVip = uni.getStorageSync('isVip');
			if (isVip === true) {
				// 展示返佣
				this.rebateShow = true;
			}
			// 获取登录状态
			let loginState = uni.getStorageSync('loginState');
			if (params.scene) { // 二维码解析进入
				// 获取scene中的数据
				let scene = decodeURIComponent(params.scene);
				let arrPara = scene.split("&");
				let arr = [];
				for (let i in arrPara) {
					arr = arrPara[i].split("=");
					if (arr[0] === "id") { // 商品id
						this.commodityId = arr[1];
					} else if (arr[0] === "s") { // 分享码中的推荐人id
						this.superiorUser = arr[1];
						uni.setStorageSync('superiorUser', this.superiorUser);
					}
				}

				// 只有在未登录的情况下出现要求登陆的弹窗
				if (!loginState) {
					this.loginTipShow = true;
				}
				this.getData(this.commodityId);
			} else if (params.s && params.id) { // 通过分享卡片进入

				this.superiorUser = params.s;
				uni.setStorageSync('superiorUser', this.superiorUser);
				this.commodityId = params.id;
				this.getData(this.commodityId);

				// 只有在未登录的情况下出现要求登陆的弹窗
				if (!loginState) {
					this.loginTipShow = true;
				}
			} else { // 首页商品跳转进入
				this.superiorUser = null;
				this.commodityId = params.id;
				this.getData(this.commodityId);
			}

			// 获取海报所需要的数据
			this.getHchImage();
		},
		onShareAppMessage: function(res) {
			// 隐藏下方分享栏(如果下方有的话)
			this.deliveryFlag = false;

			// todo path通过拼接商品id与superiorUser(需要进行多次测试)
			let path = '/pages/product/product?s=' + uni.getStorageSync('userId') + '&id=' + this.commodityId;
			return {
				title: this.dataDic.commodityTitle,
				path: path,
				imageUrl: this.titleImg[0]
			}
		},
	}
</script>

<style lang='scss'>
	// 海报
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
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-direction: column;
		z-index: 5;
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
			position: relative;
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

	.canvas {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
	}

	page {
		background: $page-color-base;
		padding-bottom: 98rpx;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 750rpx;
		position: relative;

		swiper {
			height: 100%;
		}

		indicator {
			height: 10rpx;
			width: 10rpx;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {

			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(48, 48, 56, 1);
			color: $font-color-dark;
			padding: 10rpx;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			height: 64upx;
			padding: 10rpx 0;
			font-size: 26rpx;
			font-weight: 400;
			color: $uni-color-primary;
		}

		.price {
			font-size: 32rpx;
			font-weight: 800;
			color: #FF7E30;
		}

		.m-price {
			font-weight: 400;
			margin: 0 12upx;
			color: #999999;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}

	.c-list {
		border-width: 1rpx 0 1rpx 0;
		border-style: solid;
		border-color: rgba(243, 243, 243, 0.7);
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: row;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.shop-container {
			width: 640rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}

		.shop-info-container {
			max-width: 450rpx;
			display: flex;
			flex-direction: column;
		}

		.address-txt {
			max-width: 450rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #808080;
			display: -webkit-box;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
		}

		.nav-text-style {
			text-align: right;
			min-width: 190rpx;
			margin-top: auto;
			margin-bottom: auto;
			float: right;
			color: $renduoduo-primary-txt;
			font-size: 30rpx;
			font-weight: 500;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	.buyView {
		border: none;
		font-size: 28rpx;
		color: #FFFFFF;
		display: inline-block;
		background-color: #06C1AE;
		height: 98rpx;
		width: 50vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bottom {
		z-index: 2;
		box-shadow: 0px -6px 10px 0px rgba(116, 116, 116, 0.06);
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		display: flex;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		background-color: #06C1AE;
	}

	// 准备购买时弹窗动画
	@keyframes slideContentUp {
		from {
			transform: translateY(100%);
			/*设置为正数则底部弹出来，负数则相反*/
		}

		to {
			transform: translateY(0%);
		}
	}

	@keyframes slideContentDown {
		from {
			transform: translateY(0%);
		}

		to {
			transform: translateY(100%);
		}
	}

	/* 显示或关闭内容时动画 */

	.open-ready-to-buy {
		animation: slideContentUp 0.5s ease-in both;
		/* animation-fill-mode: both 动画将会执行 forwards 和 backwards 执行的动作。 */
	}

	.close-ready-to-buy {
		animation: slideContentDown 0.5s ease-in both;
		/* animation-fill-mode: both 动画将会执行 forwards 和 backwards 执行的动作。 */
	}


	.cart-item {
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
		background-color: #FFFFFF;
		width: 100%;
		z-index: 4;
		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 0rpx;
		padding: 30rpx 0;

		.commodity-info-container {
			margin: 0 5%;
			display: flex;
			flex-direction: row;
		}

		.commodity-info-image {
			width: 210rpx;
			height: 210rpx;
		}

		.cancel-txt {
			/* margin-right: 20rpx; */
			font-size: 28rpx;
			color: $font-color-light;
		}

		.selected-attr-container {}

		.selected-attr-txt {
			word-break: break-all;
			font-size: 25rpx;
			font-weight: 500;
			display: -webkit-box;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
		}

		.price-container {
			margin-top: auto;
			/* display: flex; */
			/* 	flex-direction: row; */
			font-weight: 700;
			color: rgba(255, 126, 48, 1);
		}

		.small-price-txt {
			margin-top: auto;
			font-size: 24rpx;
		}

		.big-price-txt {
			text-align: bottom;
			font-size: 31rpx;
		}

		// 商品属性start
		.commodity-attr-list-container {
			margin: 0 5%;
			max-height: 500rpx;
			overflow: auto;
		}

		.commodity-attr-container {
			width: 100%;
			overflow: hidden;
			margin-top: 10rpx;
			border-bottom: 1rpx solid #F3F3F3;
			display: flex;
			flex-direction: column;
		}

		.commodity-attr-name {
			/* width: 20%; */
			/* float: left; */
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 500;
			padding: 15rpx 0;
		}

		.commodity-attr-value-container {
			width: 80%;
			float: left;
			padding: 15rpx 0 30rpx 0;
			overflow: hidden;
		}

		.commodity-attr-value {
			float: left;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			background: rgba(234, 234, 234, 1);
			opacity: 0.5;
			border-radius: 10rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #333333;
			padding: 0 20rpx;
			margin-top: 5rpx;
			margin-bottom: 5rpx;
			margin-right: 30rpx;
		}

		// 该属性被选中
		.commodity-attr-value-active {
			color: rgba(6, 193, 174, 1);
			border: 1rpx solid rgba(6, 193, 174, 1);

		}

		// 该属性未被选中
		.commodity-attr-value-disabled {
			color: #333333;
			border: 1rpx solid rgba(234, 234, 234, 1);
		}

		// 商品属性end

		// 购买数量与立即购买按钮的box
		.purchase-number-container {
			margin: 40rpx 5%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.image-wrapper {
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position: relative;

			image {
				border-radius: 8upx;
			}
		}

		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			position: relative;
			padding-left: 30upx;

			.item-right-title {
				font-size: 35rpx;
				font-weight: bold;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 320rpx;
			}

			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}

			.attr {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}

			.price {
				font-size: 28rpx;

				font-weight: 500;
				color: rgba(255, 126, 48, 1);
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			position: relative;
			width: 100rpx;
			right: 20rpx;
			font-size: 28rpx;

			color: $font-color-light;
		}
	}

	.container {
		width: 100%;
		height: 100%;
	}

	.noDataPic {
		width: 200rpx;
		height: 200rpx;
		padding-top: 20vh;
	}

	.nodataText {
		font-size: 24rpx;
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #CCCCCC;
	}

	.buyButton {
		margin-left: 10rpx;
		margin-right: 0;
		background-color: #FFFFFF;
		color: rgba(6, 193, 174, 1);
		font-size: 24rpx;
		height: 63rpx;
		width: 180rpx;
		border: 1rpx solid rgba(6, 193, 174, 1);
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		padding-bottom: 20rpx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-weight: 500;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				/* z-index: 1; */
			}

			/* 	&:after {
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			} */

			.line {
				position: absolute;
				height: 1rpx;
				background: #CCCCCC;
				width: 400rpx;
			}
		}
	}

	/* 分享返佣样式 */
	.rebate-container {
		position: fixed;
		bottom: 300rpx;
		right: 26rpx;
		width: 180rpx;
		height: 250rpx;
		display: flex;
	}

	.rebate-img-container {
		position: absolute;
		margin: 18rpx 15rpx 0 0;
		padding: 0;
		width: 165rpx;
		height: 235rpx;
		background-color: transparent;
	}

	.rebate-img {
		width: 100%;
		height: 100%;
	}

	.rebate-close {
		position: absolute;
		right: 0;
		top: 0;
		width: 40rpx;
		height: 40rpx;
	}

	.rebate-text {
		position: absolute;
		left: 0;
		width: 100%;
		font-weight: bold;
		top: 50rpx;
		line-height: 200rpx;
		font-size: 28rpx;
		color: #FFF3DB;
		margin-bottom: 45rpx;
		text-align: center;
	}

	/* 未登录的提示弹窗 */
	.login-tip {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.login-tip-bg {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.login-tip-container {
		margin: auto;
		width: 580rpx;
		height: 260rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.login-tip-title {
		display: inline-block;
		width: 580rpx;
		margin: 20rpx 0;
		text-align: center;
		font-weight: bold;
		font-size: 32rpx;
		color: #333;
	}

	.login-tip-content {
		display: inline-block;
		width: 580rpx;
		margin: 20rpx 0 40rpx 0;
		text-align: center;
		font-size: 30rpx;
	}

	.login-tip-btn-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.login-tip-button-cancel {
		background: none;
		border: none;
		display: inline-block;
		text-align: center;
		border-width: 0 1rpx 0 0;
		border-style: dashed;
		border-color: #f3f3f3;
		height: 80rpx;
		width: 288rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #FF5730;
	}

	.login-tip-button-update {
		background: none;
		border: none;
		display: inline-block;
		text-align: center;
		width: 290rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #06C1AE;
	}
</style>
