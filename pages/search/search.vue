<template>
	<view class="content">
		<view class="searchHead">
			<view class="searchBorder">
				<image class="searchImg" src="../../static/search/search.png" @click="doSearch(false)"></image>
				<UniSInput type="text" class="searchFont" @inputValue="getInputValue"   placeholder="请输入要搜索的商品"   :keyword="keyword"></UniSInput>
				<!-- <input type="text" class="searchFont" placeholder="请输入要搜索的商品" @confirm ="doSearch(false)" confirm-type="search"/> -->
			</view>
			<view class="cancel" @click="back()">取消</view>
			<!-- <view class="cancel" @click="doSearch(false)">取消</view> -->
		</view>
		<!-- <view class="search-box"> -->
			<!-- <! mSearch组件 如果使用原样式，删除组件元素--> 
			<!-- <UniSInput class="searchFont " @inputValue="getInputValue"   placeholder="请输入要搜索的商品" ></UniSInput> --> 
			<!-- <mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @input="inputChange" @confirm="doSearch(false)" ></mSearch> -->
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<!-- 			
			<view class="input-box">
				<input  :placeholder="defaultKeyword" @input="inputChange" v-model="keyword" @confirm="doSearch(false)"
				 placeholder-class="placeholder-class" confirm-type="search">
			</view>
			<view class="search-btn" @tap="doSearch(false)">搜索</view> 
			-->
			<!-- 原样式 end -->
		<!-- </view> -->
		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in keywordList" :key="row.keyword">
					<view class="keyword-text" @tap="doSearch(row.keyword)">
						<rich-text :nodes="row.htmlStr"></rich-text>
					</view>
					<view class="keyword-img" @tap="setkeyword(row)">
						<image src="/static/HM-search/back.png"></image>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view style="font-size: 28rpx;font-weight: bold;">历史搜索</view>
						<view>
							<image @tap="oldDelete" src="/static/HM-search/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="(keyword,index) in oldKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
				</view>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view style="font-size: 28rpx;font-weight: bold;">热门搜索</view>
						<view>
							<image @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
						</view>
					</view>
					<view class="keyword" v-if="forbid==''">
						<view v-for="(keyword,index) in hotKeywordList" @tap="doSearch(keyword)" :key="index">{{keyword}}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>当前搜热门搜索已隐藏</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//引用mSearch组件，如不需要删除即可
	import {api} from './api.js'
	import UniSInput from '../components/s-input/uni-s-input.vue'
	export default {
		data() {
			return {
				defaultKeyword: "",
			    keyword: '',
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				shopList:[],
				isShowKeywordList: false
			}
		},
		mounted() {
			this.init();
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			UniSInput
		},
		methods: {
			init() { 
				
			    this.loadDefaultKeyword();
				this.loadOldKeyword();
				this.loadHotKeyword();
				// this.drawCorrelativeKeyword(this.keywordList, this.keyword);
			},
			blur(){
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "默认关键字";
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
				console.log(this.oldKeywordList)
			},
			// 加载热门搜索
			loadHotKeyword() {
				//定义热门搜索关键字
				let p = {
					name:'hot_shops'
				}
				api.selectDict(p).then(res=>{
					if(res.data.data!=null){
						this.hotKeywordList  = res.data.data.content.split('/');
						// this.hotKeywordList = hotShops;
						console.log(this.hotKeywordList)
					}
				}).catch(err =>{
					console.log(err);
				})
			},
			//获取商品信息
			getProducts(data,keywords){	
				let p = {
					commodityTitle:data
				};
				api.getProducts(p).then(res => {
					this.shopList = res.data.data;
					if(this.shopList == null){
						this.isShowKeywordList = false;
					}else{
					    this.isShowKeywordList = true;	
				        this.keywordList = this.drawCorrelativeKeyword(this.shopList, keywords);
					}
								
				}).catch(err => {
					 console.log(err);
				})
				
			},
			//监听输入
			getInputValue(event) {
				//兼容引入组件时传入参数情况
				var keywords = event.detail?event.detail.value:event;
				this.keyword = keywords.value;
				console.log(this.keyword)
				if (!keywords) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				if(event.value != ""){
					console.log(event.value);
					this.getProducts(event.value,keywords);
				}else{
					console.log(event.value);
					this.isShowKeywordList = false;
					this.keywordList = null;	
				}
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				console.log(keywords);
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					 var row = keywords[i].commodityTitle;
					//定义高亮#9f9f9f
					console.log("right")
					var html = row.replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row,
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				console.log(keywordArr);
				return keywordArr;
				
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
				console.log(this.keyword)
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//返回主页面
			back(){
				uni.navigateBack({
					url: `/pages/homePage/homePage`
				})
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			//执行搜索
			doSearch(key) {
			    key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				console.log("历史："+key);
				if(key == '默认关键字'){
					uni.showToast({
						title: "请输入要搜索的内容！",
						icon: 'none',
						duration: 2000
					});
				}else{
					this.keyword = key;
					this.saveKeyword(key); //保存为历史 
					uni.navigateTo({
						url:`/pages/classification/classification?key=${key}?isSearch=false`
					})
				}	
				// uni.showToast({
				// 	title: key,
				// 	icon: 'none',
				// 	duration: 2000
				// });
				// //以下是示例跳转淘宝搜索，可自己实现搜索逻辑
				// //#ifdef APP-PLUS
				// plus.runtime.openURL(encodeURI('taobao://s.taobao.com/search?q=' + key));
				// //#endif
				// //#ifdef H5
				// window.location.href = 'taobao://s.taobao.com/search?q=' + key
				// //#endif
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						console.log(res.data);
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						console.log("记录："+OldKeys);
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
						console.log("历史记录"+this.oldKeywordList);
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	}
</script>
<style>
	view{display:block;}
	.searchHead{
		display: inline-block;
		width: 750rpx;
		height: 110rpx;
		background-color: #de2032;
	}
	.searchBorder{
		position: relative;
		left: 30rpx ;
		top: 10rpx;
		width: 600rpx;
		height: 76rpx;
		background-color: #ed8794;
		border-radius: 50rpx;
	}
	.cancel{
		position: absolute;
		right: 45rpx;
		top: 26rpx;
		color: #FFFFFF;
	}
	.searchImg{
		position: absolute;
		left: 23rpx;
		top: 18rpx;
		width: 40rpx;
		height: 40rpx;
	}
	.searchFont{
		position: absolute;
		width: 480rpx;
		left: 85rpx;
		top: 18rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.search-box {
		width:95%;
		background-color:rgb(242,242,242);
		padding:15upx 2.5%;
		display:flex;
		justify-content:space-between;
	}
	.search-box .mSearch-input-box{
		width: 100%;
	}
	.search-box .input-box {
		width:85%;
		flex-shrink:1;
		display:flex;
		justify-content:center;
		align-items:center;
	}
	.search-box .search-btn {
		width:15%;
		margin:0 0 0 2%;
		display:flex;
		justify-content:center;
		align-items:center;
		flex-shrink:0;
		font-size:28upx;
		color:#fff;
		background:linear-gradient(to right,#ff9801,#ff570a);
		border-radius:60upx;
	}
	.search-box .input-box>input {
		width:100%;
		height:60upx;
		font-size:32upx;
		border:0;
		border-radius:60upx;
		-webkit-appearance:none;
		-moz-appearance:none;
		appearance:none;
		padding:0 3%;
		margin:0;
		background-color:#ffffff;
	}
	.placeholder-class {
		color:#9e9e9e;
	}
	.search-keyword {
		width:100%;
		background-color:rgb(242,242,242);
	}
	.keyword-list-box {
		height:calc(100vh - 110upx);
		padding-top:10upx;
		border-radius:20upx 20upx 0 0;
		background-color:#fff;
	}
	.keyword-entry-tap {
		background-color:#eee;
	}
	.keyword-entry {
		width:94%;
		height:80upx;
		margin:0 3%;
		font-size:30upx;
		color:#333;
		display:flex;
		justify-content:space-between;
		align-items:center;
		border-bottom:solid 1upx #e7e7e7;
	}
	.keyword-entry image {
		width:60upx;
		height:60upx;
	}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {
		height:80upx;
		display:flex;
		align-items:center;
	}
	.keyword-entry .keyword-text {
		width:90%;
	}
	.keyword-entry .keyword-img {
		width:10%;
		justify-content:center;
	}
	.keyword-box {
		height:calc(100vh - 110upx);
		border-radius:20upx 20upx 0 0;
		background-color:#fff;
	}
	.keyword-box .keyword-block {
		padding:10upx 0;
	}
	.keyword-box .keyword-block .keyword-list-header {
		width:94%;
		padding:10upx 3%;
		font-size:27upx;
		color:#333;
		display:flex;
		justify-content:space-between;
	}
	.keyword-box .keyword-block .keyword-list-header image {
		width:40upx;
		height:40upx;
	}
	.keyword-box .keyword-block .keyword {
		width:94%;
		padding:3px 3%;
		display:flex;
		flex-flow:wrap;
		justify-content:flex-start;
	}
	.keyword-box .keyword-block .hide-hot-tis {
		display:flex;
		justify-content:center;
		font-size:28upx;color:#6b6b6b;
	}
	.keyword-box .keyword-block .keyword>view {
		display:flex;
		justify-content:center;
		align-items:center;
		border-radius:60upx;
		padding:0 20upx;
		margin:10upx 20upx 10upx 0;
		height:60upx;
		font-size:28upx;
		background-color:rgb(242,242,242);color:#6b6b6b;
	}
</style>
