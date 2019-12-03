<template>
	<view>
		<time-line ref="timeline" location="center" title="轨迹信息"></time-line>
	</view>
</template>

<script>
	import timeLine from '../components/xuan-timeLine/xuan-timeLine.vue'

	export default {
		data() {
			return {
				hasTraces: true, // 是否有物流轨迹
				requestParams: { // 请求物流信息的参数
					OrderCode: '',
					ShipperCode: '',
					LogisticCode: '',
					EBusinessID: 'asdfasdf'
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
			console.log();
			if (params) {
				this.requestParams.ShipperCode = params.ShipperCode;
				this.requestParams.LogisticCode = params.LogisticCode;
				
				this.requestParams.ShipperCode = 'SF';
				this.requestParams.LogisticCode = '118650888018';
				
				this.requestTraces();
			} else {
				hasTraces = false;
			}
		},
		methods: {
			// 请求物流轨迹
			requestTraces: function() {
				let params = JSON.stringify(this.requestParams);
				console.log('请求参数');
				console.log(params);
				uni.request({
					url: 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json',
					data: params,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
					},
					success: function(res) {
						console.log(res);
					}
				});
			},
		},
	}
</script>

<style>

</style>
