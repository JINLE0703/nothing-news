<template>
	<view class="detail">
		<!-- 文章标题 -->
		<view class="detail-title">
			{{formData.title}}
		</view>
		<!-- 文章头部 -->
		<view class="detail-header">
			<!-- logo -->
			<view class="detail-header-logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<!-- 文章信息 -->
			<view class="detail-header-content">
				<!-- 文章作者 -->
				<view class="detail-header-content-author">
					{{formData.author.author_name}}
				</view>
				<!-- 文章信息 -->
				<view class="detail-header-content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<!-- 关注作者 -->
			<button class="detail-header-button" type="default" @click="fellowAuthor(formData.author.id)">{{formData.is_author_lile?'已关注':'关注+'}}</button>
		</view>
		<!-- 文章内容信息 -->
		<view class="detail-content">
			<!-- 文章内容 -->
			<view class="detail-content-html">
				<u-parse :content="formData.content" :noData="noData"></u-parse>
			</view>
			<!-- 评论区 -->
			<view class="detail-comment">
				<view class="detail-comment-title">最新评论</view>
				<view class="detail-comment-content" v-for="item in commentsList" :key="item.comment_id">
					<comments :comments="item" @reply="reply"></comments>
				</view>
			</view>
		</view>
		<!-- 底部工具栏 -->
		<view class="detail-bottom">
			<!-- 评论输入框 -->
			<view class="detail-bottom-input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<!-- 图标 -->
			<view class="detail-bottom-icons">
				<!-- 查看评论 -->
				<view class="detail-bottom-icons-box" @click="openComments">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<!-- 关注 -->
				<view class="detail-bottom-icons-box" @click="likeTag(formData._id)">
					<uni-icons :type="formData.is_like ? 'heart-filled' : 'heart'" size="22" color="#f07373"></uni-icons>
				</view>
				<!-- 点赞 -->
				<view class="detail-bottom-icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up ? 'hand-thumbsup-filled' : 'hand-thumbsup'" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 评论框 -->
		<popup ref="popup" @submit="submit" @close="close"></popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	
	export default {
		data() {
			return {
				// 地址栏接收的参数对象 文章相关信息 懒加载
				formData: {},
				// 富文本无内容时的内容
				noData: '<p style="text-align:center;color:#666">详情加载中...</p>',
				// 评论列表
				commentsList: [],
				// 回复变量
				replyFormData: {}
			}
		},
		components: {
			uParse
		},
		onLoad(query) {
			// query 地址栏接收参数
			this.formData = JSON.parse(query.params)
			this.getDetail()
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
			// 关注作者
			fellowAuthor(author_id) {
				this.updateAuthor(author_id)
			},
			// 收藏文章
			likeTag(article_id) {
				this.updateLike(article_id)
			},
			// 点赞文章
			thumbsup(article_id) {
				this.updateThumbsup(article_id)
			},
			// 打开评论列表
			openComments() {
				uni.navigateTo({
					url: '/pages/detail-comments/detail-comments?id='+this.formData._id
				})
			},
			// 获取文章详情
			async getDetail() {
				const {
					data
				} = await this.$api.get_detail({
					article_id: this.formData._id
				})
				this.formData = data
			},
			// 请求更新评论
			async updataComment(commentsValue) {
				// 请求数据
				const data = {
					article_id: this.formData._id,
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
				this.getComments()
				this.closeComment()
			},
			// 请求评论内容
			async getComments() {
				const {data} = await this.$api.get_comments({
					article_id: this.formData._id
				})
				this.commentsList = data
			},
			// 请求更新关注作者
			async updateAuthor(author_id) {
				uni.showLoading()
				const {data} = await this.$api.update_author({
					author_id: author_id
				})
				uni.hideLoading()
				this.formData.is_author_lile = !this.formData.is_author_lile
				uni.showToast({
					title: this.formData.is_author_lile?'关注成功':'取消关注',
					icon: 'none'
				})
				uni.$emit('update_author')
			},
			// 收藏文章请求
			async updateLike(article_id) {
				uni.showLoading()
				await this.$api.update_likes({
					article_id: article_id
				})
				uni.hideLoading()
				this.formData.is_like = !this.formData.is_like
				uni.showToast({
					title: this.formData.is_like?'收藏成功':'取消收藏',
					icon: 'none'
				})
				// 通知上级收藏成功
				uni.$emit('update_article','follow')
			},
			// 点赞文章请求
			async updateThumbsup(article_id) {
				uni.showLoading()
				const res = await this.$api.update_thumbsup({
					article_id: article_id
				})
				uni.hideLoading()
				// 文章没被点过赞
				if(!this.formData.is_thumbs_up) {
					this.formData.is_thumbs_up = true
					this.formData.thumbs_up_count++
				}
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;

		.detail-title {
			padding: 0 15px;
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}

		.detail-header {
			display: flex;
			align-items: center;
			margin-top: 10px;
			padding: 0 15px;

			.detail-header-logo {
				flex-shrink: 0;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-header-content {
				width: 100%;
				padding-left: 10px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-size: 12px;

				.detail-header-content-author {
					font-size: 14px;
					color: #333;
				}

				.detail-header-content-info {
					color: #999;

					text {
						margin-right: 10px;
					}
				}
			}
			
			.detail-header-button {
				flex-shrink: 0;
				height: 30px;
				font-size: 12px;
				background-color: $mk-base-color;
				color: #fff;
			}
		}

		.detail-content {
			margin-top: 20px;
			min-height: 500px;

			.detail-content-html {
				padding: 0 15px;
			}
			
			.detail-comment{
				margin-top: 30px;
				
				.detail-comment-title {
					padding: 10px 15px;
					font-size: 14px;
					color: #666;
					border-bottom: 1px #f5f5f5 solid;
				}
				.detail-comment-content {
					padding: 0 15px;
					border-top: 1px #eee solid;
				}
			}
		}

		.detail-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			width: 100%;
			height: 44px;
			border-top: 2px #f5f5f5 solid;
			background-color: #fff;
			box-sizing: border-box;
			box-shadow: 0 0 5px #f5f5f5;

			.detail-bottom-input {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 10px;
				padding: 0 10px;
				width: 100%;
				height: 30px;
				border: 1px #ddd solid;
				border-radius: 5px;

				text {
					font-size: 14px;
					color: #999;
				}
			}

			.detail-bottom-icons {
				display: flex;
				flex-shrink: 0;
				padding: 0 10px;

				.detail-bottom-icons-box {
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 44px;
				}
			}
		}
		
		
	}
</style>
