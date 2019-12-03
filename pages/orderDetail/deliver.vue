<template>
	<view>
		<time-line ref="timeline" location="center" title="轨迹信息"></time-line>
	</view>
</template>

<script>
	import timeLine from '../components/xuan-timeLine/xuan-timeLine.vue'
	import {DeliverAPI} from './deliverAPI.js'

	export default {
		data() {
			return {
				hasTraces: true, // 是否有物流轨迹
				requestParams: { // 请求物流信息的参数
					deliveryNum: '',
					deliveryCompany: ''
				}
			}
		},
		components: {
			timeLine
		},
		onPageScroll: function() {
			this.$refs.timeline.getScroll();
		},
		onLoad: function(params) {
			console.log(params);
			if (params) {
				this.requestParams.deliveryNum = params.deliveryNum;
				this.requestParams.deliveryCompany = params.deliveryCompany;
				
				// 测试
				this.requestParams.deliveryNum = '75311669293386';
				this.requestParams.deliveryCompany = '中通快递';
				
				this.getTraces();
			} else {
				hasTraces = false;
			}
		},
		methods: {
			// 请求物流轨迹
			getTraces: function() {
				DeliverAPI.getDeliverInfo(this.requestParams).then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
				});
			},
		},
	}
</script>

<style>

</style>
