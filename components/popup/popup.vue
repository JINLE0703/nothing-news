<template>
	<view>
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header-item" @click="close">取消</text>
					<text class="popup-header-item" @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-content-textarea" v-model="commentsValue" maxlength="200" fixed placeholder="请输入评论内容..." />
					<view class="popup-content-count">{{commentsValue.length}}/200</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		props:{
			
		},
		data() {
			return {
				// 评论内容
				commentsValue: ''
			};
		},
		methods: {
			open() {
				this.commentsValue = ''
				this.$refs.popup.open()
			},
			close() {
				this.commentsValue = ''
				this.$refs.popup.close()
				this.$emit('close')
			},
			submit() {
				// 发布内容为空
				if(!this.commentsValue) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					})
					return
				}
				this.$emit('submit',this.commentsValue)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-wrap {
		background-color: #fff;
		
		.popup-header {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			border-bottom: 1px #f5f5f5 solid;
			
			.popup-header-item {
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		
		.popup-content {
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			
			.popup-content-textarea {
				width: 100%;
				height: 200px;
			}
			
			.popup-content-count {
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				color: #999;
			}
		}
	}
</style>
