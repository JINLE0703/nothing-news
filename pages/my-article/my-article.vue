<template>
	<view>
		<uni-load-more v-if="list.length === 0 && !articleShow" status="loading"></uni-load-more>
		<list-card v-for="item in list" :key="item._id" :item="item"></list-card>
		<view v-if="articleShow" class="no-data">您还没有发表过文章</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				articleShow: false
			}
		},
		onLoad() {
			this.getMyArticle()
		},
		methods: {
			// 获取我的文章
			async getMyArticle() {
				const {data} = await this.$api.get_my_article()
				this.list = data
				this.articleShow = this.list.length === 0 ? true : false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.no-data {
		padding: 50px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
