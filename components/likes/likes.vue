<template>
	<view class="likes-icons" @click.stop="likeTag">
		<uni-icons :type="like ? 'heart-filled' : 'heart'" size="20" color="#f07373"></uni-icons>
	</view>
</template>

<script>
	export default {
		props: {
			// 文章对象
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			// 判断自定义事件触发的对象
			types: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				// 是否喜欢
				like: false
			}
		},
		watch: {
			item(newVal) {
				this.like = newVal.is_like
			}
		},
		created() {
			this.like = this.item.is_like
		},
		methods: {
			// 点击喜欢按钮
			likeTag() {
				this.updateLikes()
				this.like = !this.like
			},
			// 更新喜欢数据（喜欢/取消）
			async updateLikes() {
				try {
					uni.showLoading()
					const res = await this.$api.update_likes({
						// 文章 id
						article_id: this.item._id
					})
					uni.hideLoading()
					uni.showToast({
						title: this.like ? '喜欢成功' : '取消喜欢',
						icon: 'none'
					})
					// 通知上级收藏成功
					uni.$emit('update_article',this.types)
				} catch (err) {
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.likes-icons {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
	}
</style>
