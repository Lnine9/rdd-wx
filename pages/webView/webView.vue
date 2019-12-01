<template>
    <view>
		<rich-text :nodes="desc"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				desc: '',
			}
		},
		onLoad(data) {
			this.desc = getApp().globalData.desc
			getApp().globalData.desc = ``
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
