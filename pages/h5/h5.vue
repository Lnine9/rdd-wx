<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
			}
		},
		onLoad(options) {
			if (options && options.url) {
				this.url = decodeURIComponent(options.url);
			}
		},
	}
</script>

<style>

</style>
