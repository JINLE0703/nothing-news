<template>
	<view class="follow">
		<!-- 导航切换 -->
		<view class="follow-tab">
			<view class="follow-tab-box">
				<view class="follow-tab-item" :class="{active:activeIndex === 0}" @click="tab(0)">文章</view>
				<view class="follow-tab-item" :class="{active:activeIndex === 1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<!-- 列表内容 -->
		<view class="follow-list">
			<swiper class="follow-list-swiper" :current="activeIndex" @change="swiperChange">
				<!-- 关注文章 -->
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="list.length === 0 && !articleShow" iconType="snow" status="loading"></uni-load-more>
						<list-card types="follow" v-for="item in list" :key="item._id" :item="item"></list-card>
						<view v-if="articleShow" class="no-data">没有收藏文章</view>
					</list-scroll>
				</swiper-item>
				<!-- 关注作者 -->
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="authorList.length === 0 && !authorShow" iconType="snow" status="loading"></uni-load-more>
						<list-author v-for="item in authorList" :key="item.id" :item="item"></list-author>
						<view v-if="authorShow" class="no-data">没有关注作者</view>
					</list-scroll>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				// 收藏内容列表
				list: [],
				// 是否没有喜欢文章
				articleShow: false,
				// 关注作者列表
				authorList: [],
				authorShow: false
			}
		},
		onLoad() {
			// 获取自定义事件 只能在打开的页面触发
			uni.$on('update_article',()=>{
				this.getFollow()
			})
			uni.$on('update_author',()=>{
				this.getAuthor()
			})
			this.getFollow()
			this.getAuthor()
		},
		methods: {
			// 滑动视图变化
			swiperChange(e) {
				this.activeIndex = e.detail.current
			},
			// 点击切换导航
			tab(index) {
				this.activeIndex = index
			},
			// 获取收藏内容
			async getFollow() {
				const {data} = await this.$api.get_follow()
				this.list = data
				this.articleShow = this.list.length === 0 ? true : false
			},
			// 获取关注作者信息
			async getAuthor() {
				const {data} = await this.$api.get_author()
				this.authorList = data
				this.authorShow = this.authorList.length === 0 ? true : false
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		display: flex;
	}

	.follow {
		height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;

		.follow-tab {
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px #f5f5f5 solid;

			.follow-tab-box {
				display: flex;
				width: 100%;
				height: 100%;
				border-radius: 5px;
				border: 1px $mk-base-color solid;

				.follow-tab-item {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					font-size: 14px;
					color: $mk-base-color;

					&:first-child {
						border-right: 1px $mk-base-color solid;
					}

					&.active {
						color: #fff;
						background-color: $mk-base-color;
					}
				}
			}
		}

		.follow-list {
			flex: 1;
			
			.follow-list-swiper {
				height: 100%;
				
				.follow-list-swiper-item {
					height: 100%;
				}
			}
		}
	}
	
	.no-data{
		padding: 50px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
