<template>
    <view class="container">
      <!--  <view class="label-title">{{label}}</view> -->
        <input :class="inputClass" :type="type" @input="inputChange" :id="id" :placeholder-class="placeholderClass" :placeholder="placeholder" @confirm ="doSearch()" confirm-type="search"  :value="value" placeholder-style="color:#FFFFFF" v-model="keyword">
        <view v-if="value" class="clear-icon" @click="restInput">x</view>
    </view>
</template>

<script>
export default {
    name: 'UniSInput',
    props: {
        placeholder: { // 输入框空时占位符
            type: String,
            default: '请输入'
        },
        placeholderClass: { // placeholder的class，方便自定义placeholder样式
            type: String,
            default: 'input-placeholder'
        },
        inputClass: {
            type: String,
            default: 's-input'
        },
        id: { // 唯一标识符，当多个输入框时获取对应输入框的值
            type: String,
            default: 'inputValue'
        },
        type: { // 输入框类型
            type: String,
            default: 'text'
        },
		keyword: {
			type: String,

		},
        initValue: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            value: ''
        }
    },
    methods: {
		//调用父组件搜索
		doSearch(){
			this.$parent.doSearch(false);
		},
		//清空
        restInput () {
            this.value = ''
            this.$emit('inputValue', {
                id: this.id,
                value: this.value
            })
        },
        inputChange (e) {
            this.value = e.detail.value
            this.$emit('inputValue', {
                id: this.id,
                value: e.detail.value
            })
        }
    },
    created () {
        this.value = this.initValue
		console.log("bkb" + this.initValue)
        this.$emit('inputValue', {
            id: this.id,
            value: this.initValue
        })
    }
}
</script>

<style lang="scss" scoped>
    // @import "common/variables.scss";
    .container {
        display: flex;
        flex-direction: row;
        display: flex;
        align-items: center;
    }
    .label-title {
        font-size: 32upx;
    }
    .s-input {
        padding-left: 20upx;
        width: 500rpx;
    }
    .clear-icon {
        width: 30upx;
        height: 30upx;
        border-radius: 50%;
        color: #ffffff;
		background-color: rgba($color: #FFFFFF, $alpha: 0.5);
        font-size: 20upx;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .input-placeholder {
        font-size: 32upx;
        color: #FFFFFF;
    }
</style>
