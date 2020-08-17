<template>
	<view class="comments">
		<view class="comments-header">
			<!-- logo -->
			<view class="comments-header-logo">
				<image :src="comments.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="comments-header-info">
				<!-- 评论作者 -->
				<view v-if="!comments.is_reply" class="comments-header-info-title">{{comments.author.author_name}}</view>
				<view v-else class="comments-header-info-title">{{comments.author.author_name}}<text class="reply-text">回复</text>{{comments.to}}</view>
				<!-- 评论时间 -->
				<view>{{comments.create_time | formatTime}}</view>
			</view>
		</view>
		<!-- 评论内容 -->
		<view class="comments-content">
			<view>{{comments.comment_content}}</view>
			<!-- 回复按钮 -->
			<view class="comments-content-info">
				<view class="comments-content-info-button" @click="commentsReply({comments,is_reply:reply})">回复</view>
			</view>
			<!-- 回复区域 递归组件 -->
			<view class="comments-content-reply" v-for="item in comments.replys" :key="item.comment_id">
				<comments :reply="true" :comments="item" @reply="commentsReply"></comments>
			</view>
		</view>
	</view>
</template>

<script>
	import comments from '@/components/comments/comments.vue'
	import {parseTime} from '@/common/js/parse-time.js'
	
	export default {
		name: 'comments',
		props:{
			// 评论信息
			comments: {
				type: Object,
				default() {
					return {}
				}
			},
			// 是否为回复的回复
			reply: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			};
		},
		components: {
			comments
		},
		filters: {
			formatTime(time) {
				return parseTime(time)
			}
		},
		methods: {
			// 回复
			commentsReply(comment) {
				// 区分主回复还是子回复
				if(comment.is_reply) {
					// 子回复
					// reply_id 为 被评论的评论id
					comment.comments.reply_id = comment.comments.comment_id
					comment.comments.comment_id = this.comments.comment_id
				}
				this.$emit('reply',comment)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comments {
		margin: 15px 0;
		
		.comments-header {
			display: flex;
			
			.comments-header-logo {
				flex-shrink: 0;
				width: 30px;
				height: 30px;
				border-radius: 50%;
				overflow: hidden;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			
			.comments-header-info {
				display: flex;
				flex-direction: column;
				padding-left: 15px;
				font-size: 12px;
				color: #999;
				line-height: 1;
				
				.comments-header-info-title {
					margin-bottom: 10px;
					font-size: 14px;
					color: #333;
					
					.reply-text {
						margin: 0 10px;
						font-weight: bold;
						color: #000;
					}
				}
			}
			
		}
		
		.comments-content {
			margin-top: 10px;
			font-size: 14px;
			color: #000;
			
			.comments-content-info {
				margin-top: 15px;
				display: flex;
				
				.comments-content-info-button {
					padding: 2px 10px;
					font-size: 12px;
					color: #999;
					border: 1px #ccc solid;
					border-radius: 20px;
				}
			}
			
			.comments-content-reply{
				display: flex;
				margin: 15px 0;
				padding: 0 10px;
				border: 1px #eee solid;
			}
		}
	}
</style>
