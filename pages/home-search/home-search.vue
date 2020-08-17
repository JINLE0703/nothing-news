<template>
	<view class="home">
		<navbar :isSearch="true" v-model="value" @input="inputChanged"></navbar>
		<view class="home-list">
			<!-- 无搜索页 -->
			<view v-if="isHistory" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<uni-icons type="trash" size="18" color="#666" @click="clear"></uni-icons>
				</view>
				<!-- 有搜索历史 -->
				<view v-if="historyList.length > 0" class="label-content">
					<view class="label-content-item" v-for="(item,index) in historyList" :key="index" @click="openHistory(item)">
						{{item.name}}
					</view>
				</view>
				<!-- 无搜索历史 -->
				<view v-else class="no-data">
					没有搜索记录
				</view>
			</view>
			<!-- 搜索页 -->
			<list-scroll v-else>
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="searchList.length > 0">
					<list-card v-for="item in searchList" :key="item._id" :item="item" @click="cardClicked"></list-card>
				</view>
				<view v-if="searchList.length === 0 && !loading" class="no-data">没有搜索到相关数据</view>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				// 是否为历史搜索界面
				isHistory: true,
				// 搜索卡片内容列表
				searchList: [],
				// 搜索字段
				value: '',
				// 搜索加载
				loading: false
			}
		},
		computed: {
			...mapState(['historyList'])
		},
		methods: {
			// 搜索框输入值变化
			inputChanged(searchVal) {
				// 节流
				if (this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					this.getSearch(searchVal)
					this.timer = false
				}, 1000)
			},
			// 获取搜索列表
			async getSearch(value) {
				// 搜索值为空
				if (!value) {
					this.searchList = []
					this.isHistory = true
					return
				}
				this.isHistory = false
				this.loading = true
				// 发起请求
				const {
					data
				} = await this.$api.get_search({
					value: value
				})
				this.searchList = data
				this.loading = false
			},
			// 搜索卡片被点击
			cardClicked(item) {
				this.$store.dispatch('setHistory', {
					name: this.value
				})
			},
			// 点击历史搜索标签
			openHistory(item) {
				this.value = item.name
				this.getSearch(this.value)
			},
			// 情况搜索历史
			clear() {
				this.$store.dispatch('clearHistory')
				uni.showToast({
					title: '清空完成'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		display: flex;
		background-color: #f5f5f5;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;

		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px #f5f5f5 solid;

				.label-title {
					color: $mk-base-color;
				}

				.label-clear {
					color: #30b33a;
					font-weight: 700;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content-item {
					padding: 2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					border: 1px #666 solid;
					border-radius: 5px;
					font-size: 14px;
					color: #666;
				}

			}
		}

		.no-data {
			height: 200px;
			line-height: 200px;
			width: 100%;
			text-align: center;
			font-size: 12px;
			color: #666;
		}
	}
</style>
