<template>
	<view>
		<view class="content">
			<view class='applyInformation'>
				<text>店铺名称</text>
				<input placeholder="请输入店铺名称" class="inputName" v-model="applyInformation.shopName"/>
			</view>
			<view class='applyInformation'>
				<text>联系人</text>
				<input placeholder="请输入联系人姓名" class="inputName" v-model="applyInformation.name"/>
			</view>
			<view class='applyInformation'>
				<text>手机号</text>
				<input placeholder="请输入联系人手机号" class="inputName" v-model="applyInformation.phone"/>
			</view>
			<view class='applyInformationLines'></view>
			<view class='applyInformation1'>
				<text>所属类别</text>
				<text class="input">{{type.province}}</text>
				<image class="arrow" src="../../static/wallet/arrow.png"></image>
			</view>
			<view class='applyInformationLine'></view>
			<view class='applyInformation1'>
				<text>店铺位置</text>
				<text class="input" @tap="open">{{addressData.province}} {{addressData.city}} {{addressData.area}}</text>
				<image class="arrow" src="../../static/wallet/arrow.png" @tap="open"></image>
			</view>
			<view class='applyInformationLines'></view>
			<textarea placeholder="请输入详细地址..." v-model="applyInformation.address"></textarea>
		</view>
		<button @click="save()">保存</button>
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
	import {api} from	'./api.js'
	import wPicker from "../components/w-picker/w-picker.vue";
	export default{
		components: {
			wPicker
		},
		data(){
			return{
				applyInformation:{
					shopName:'',
					name:'',
					phone:'',
					place:'',
					address:''
				},
				type:{
					province: '请选择类别',
				},
				addressData: {
					addressId:'',
					receiver: '',
					contactNumber: '',
					province: '请选择地区',
					city:'',
					area:'',
					detail: '',
					isDefault: 0,
					}
			}
		},
		methods:{
			//打开底部弹出层
			open(){
				this.$refs.region.show();
			},
			//改变地区
			onConfirm(val){
				this.addressData.province=val.checkArr[0];
				this.addressData.city=val.checkArr[1];
				this.addressData.area=val.checkArr[2];
			},
			save(){
				let prams={
					shopName:this.applyInformation.shopName,
					userName:this.applyInformation.name,
					shopPhone:this.applyInformation.phone,
					shopType:this.applyInformation.type,// 后面要改为整形
					shopAddress:this.addressData.province+this.addressData.city+this.addressData.area+this.applyInformation.address
				}
				if(this.applyInformation.shopName==''){
					wx.showToast({
					  title: '请输入店铺名称',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}
				if(this.applyInformation.name==''){
					wx.showToast({
					  title: '请输入姓名',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}
				if(this.applyInformation.phone==''){
					wx.showToast({
					  title: '请输入手机号',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}else{
					 if(!(/^1[34578]\d{9}$/).test(this.applyInformation.phone)){
						wx.showToast({
						  title: '请输入正确的电话号码',
						  icon: 'none',
						  duration: 3000
						})	 
						return null;
					}
				}
				if(this.type.province==''){
					wx.showToast({
					  title: '选择类别不能为空',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}
				if(this.addressData.province=='请选择地区'){
					wx.showToast({
					  title: '请选择地区',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}
				if(this.applyInformation.address==''){
					wx.showToast({
					  title: '详细地址不能为空',
					  icon: 'none',
					  duration: 3000
					})
					return null;
				}
				api.addShop(prams).then(res=>{
					uni.showToast({
					  title: '保存成功',
					  icon: 'success',
					  duration: 3000
					})
				})
			}
		}
	}
</script>

<style>
	page{
		background: #F8F9FB;
	}
	
	.content{
		margin-top: 30rpx;
		border-top: #000000 dashed 1rpx;
		border-bottom: #000000 dashed 1rpx;
		width: 100%;
		height: 60%;
	}
	
	.applyInformation {
		background: #FFFFFF;
	    width: 689rpx;
		height: 60rpx;
		padding: 30rpx;
		margin-top: 2rpx;
		position: relative;
	}
	
	.applyInformation .inputName{
		margin-top: -40rpx;
		font-size: 30rpx;
		color: black;
		text-align: right;
	}
	
	.applyInformationLines{
		background: #FFFFFF;
		width: 699rpx;
		height: 4rpx;
		margin: 0 auto;
		border: #000000 dashed 1rpx;
	}
	
	.applyInformationLine{
		background: #FFFFFF;
		width: 699rpx;
		height: 1rpx;
		margin: 0 auto;
		border-top: #000000 dashed 1rpx;
	}
	
	.applyInformation1 {
		background: #FFFFFF;
	    width: 660rpx;
		height: 60rpx;
		padding: 30rpx 69rpx 20rpx 30rpx;
		margin-top: 2rpx;
		position: relative;
	}
	
	.applyInformation1 .input{
		flex: 1;
		font-size: 30rpx;
		position: absolute;
		right: 69rpx;
		top: 30rpx;
	}
	
	.applyInformation1 .arrow {
		width: 13rpx;
		height: 23rpx;
		position: absolute;
		right: 45rpx;
		top: 38rpx;
	}
	
	textarea{
		margin-top: 50rpx;
		margin-left: 30rpx;
		width: 699rpx;
		height: 200rpx;
	}
	
	button {
	    border-radius: 80rpx;
	    width: 670rpx;
		height: 88rpx;
		position: absolute;
		left: 40rpx;
		bottom: 50rpx;
	    font-size: 35rpx;
		background-color: #06C1AE;
		color: #FFFFFF;
	}
</style>
