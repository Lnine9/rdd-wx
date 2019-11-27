<template>
	<view class="content">
		<view class="row">
			<text class="tit">收货人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="请输入收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.mobile" placeholder="请输入收货人手机号" placeholder-class="placeholder" />
		</view>
		<view class="row">
			<text class="tit">所在区域</text>
			<text class="input" @tap="open">{{addressData.province}} {{addressData.city}} {{addressData.area}}</text>
			<image src="../../static/arrow.png" class="arrow"></image>
		</view>
		<view class="row">
			<textarea v-model="addressData.detail" class="bigInput" placeholder="请输入详细地址，如道路、门牌号、小区、楼栋、单元室等"/>
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.default" color="#4CD964" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">保存</button>
		<w-picker
			mode="region"
			:defaultVal="['浙江省','杭州市','滨江区']"
			:areaCode="['33','3301','330108']"
			:hideArea="false"
			@confirm="onConfirm" 
			ref="region" 
		></w-picker>
	</view>
</template>

<script>
	import wPicker from "../components/w-picker/w-picker.vue"
	export default {
		components: {
			wPicker
		},
		data() {
			return {
				manageType:'',
				addressData: {
					name: '',
					mobile: '',
					province: '',
					city:'',
					area:'',
					detail: '',
					default: false
					},
				}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				console.log(option.data)
				this.addressData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				this.addressData.default = e.detail;
			},
			
			//打开底部弹出层
			open(){
				this.$refs.region.show()
			},
			//改变地区
			onConfirm(val){
				this.addressData.province=val.checkArr[0];
				this.addressData.city=val.checkArr[1];
				this.addressData.area=val.checkArr[2];
			},
			//提交
			confirm(){
				let data = this.addressData;
				if(this.addressData.name ==''){
					wx.showToast({
					  title: '请填写收货人姓名！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.addressData.mobile)){
					wx.showToast({
					  title: '请输入正确的手机号码！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if(this.addressData.province==''){
					wx.showToast({
					  title: '请选择地址！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				if(this.addressData.detail==''){
					wx.showToast({
					  title: '请填写详细地址！',
					  icon: 'none',
					  duration: 1500
					})
					return;
				}
				
				
			}	
		}
	}
</script>

<style>
	page{
		background: #F8F9FB;
		padding-top: 16rpx;
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding: 30rpx 30rpx 30rpx 30rpx;
		position: relative;
		margin-top: 3rpx;
		border-color: #CCCCCC;
		background: #FFFFFF;
	}
	.tit{
		flex-shrink: 0;
		flex: 1;
		width: 120rpx;
		font-size: 36rpx;
	}
	.input{
		flex: 1;
		text-align: right;
		font-size: 34rpx;
	}
	.bigInput{
		width: 100%;
		height: 220rpx;
		font-size: 36rpx;
		word-wrap: break-word;
	}
	.arrow{
		margin-left: 18rpx;
		width: 18rpx;
		height: 30rpx;
	}
	.default-row{
	margin-top: 16rpx;
	}
	.add-btn{
		position: fixed;
		left: 24rpx;
		right: 30rpx;
		bottom: 16rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600rpx;
		height: 80rpx;
		font-size: 38rpx;
		color: #FFFFFF;
		background-color: #06C1AE;
		border-radius: 40rpx;	
	}
</style>
