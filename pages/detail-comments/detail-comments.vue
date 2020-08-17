<template>
	<view>
		<view class="comments-content" v-for="item in commentsList" :key="item.comment_id">
			<comments :comments="item" @reply="reply"></comments>
		</view>
		<uni-load-more v-if="commentsList.length === 0 || commentsList.length > 4" :status="loading" iconType="snow"></uni-load-more>
		<!-- 评论框 -->
		<popup ref="popup" @submit="submit" @close="close"></popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article_id: '',
				commentsList: [],
				page: 1,
				pageSize: 5,
				loading: 'loading',
				replyFormData: {}
			}
		},
		onLoad(query) {
			this.article_id = query.id
			this.getComments()
		},
		// 页面上拉触底事件
		onReachBottom() {
			if(this.loading === 'noMore') {
				return
			}
			this.page++
			this.getComments()
		},
		methods: {
			// 打开评论框
			openComment() {
				this.$refs.popup.open()
			},
			// 关闭评论框
			closeComment() {
				this.$refs.popup.close()
			},
			// 关闭评论框时触发组件的事件
			close() {
				this.replyFormData = {}
			},
			// 点击发布
			submit(commentsValue) {
				this.updataComment(commentsValue)
			},
			// 评论回复
			reply(e) {
				this.replyFormData = {
					'comment_id': e.comments.comment_id,
					'is_reply': e.is_reply
				}
				// 回复为子回复
				if(e.is_reply){
					this.replyFormData.reply_id = e.comments.reply_id
				}
				// 打开评论框
				this.openComment()
			},
			// 请求评论内容
			async getComments() {
				const {
					data
				} = await this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				})
				// 数据加载完成
				if(data.length === 0) {
					this.loading = 'noMore'
					return
				}
				this.commentsList.push(...data)
			},
			// 请求更新评论
			async updataComment(commentsValue) {
				// 请求数据
				const data = {
					article_id: this.article_id,
					content: commentsValue,
					...this.replyFormData
				}
				uni.showLoading()
				// 发布请求
				await this.$api.update_comment(data)
				uni.hideLoading()
				uni.showToast({
					title: '评论成功'
				})
				// 数据重置，避免key重复，添加重复数据
				this.commentsList =  []
				this.page = 1 
				this.loading = 'loading'
				this.getComments()
				this.closeComment()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comments-content {
		padding: 0 15px;
		border-top: 1px #eee solid;
	}
</style>
