<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item v-for="(item,index) in tab" :key="tab._id" class="swiper-item">
			<list-item :list="listCatchData[index]" :load="load[index]" @loadMore="loadMore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				list: [],
				// 每个标签页缓存列表
				listCatchData: {},
				// 每个标签页当前页的加载
				load: {},
				// 每页条数
				pageSize: 6
			}
		},
		created() {
			// 自定义事件监听收藏事件
			uni.$on('update_article', (types) => {
				if(types === 'follow') {
					this.listCatchData = {}
					this.load = {}
					this.getList(this.activeIndex)
				}
			})
		},
		watch: {
			tab(newVal) {
				if (newVal.length === 0) return
				this.getList(this.activeIndex)
			}
		},
		methods: {
			// 滑块视图改变
			change(e) {
				// e.detail.current 切换后当前页面索引
				const {
					current
				} = e.detail
				// console.log(this.tab[current].name)
				// 当数据不存在 或者 长度为 0 才请求数据
				if (!this.listCatchData[current] || this.listCatchData[current].length === 0) {
					this.getList(current)
				}
				this.$emit('swiperChanged', current)
			},
			// 获取文章列表
			async getList(current) {
				// 当前页初始化
				if (!this.load[current]) {
					this.load[current] = {
						// 当前页
						page: 1,
						// 加载状态
						loading: 'loading'
					}
				}
				// 发起请求
				const {
					data
				} = await this.$api.get_list({
					name: this.tab[current].name,
					page: this.load[current].page,
					pageSize: this.pageSize
				})
				// 没有数据返回
				if (data.length === 0) {
					let oldLoad = {
						page: this.load[current].page,
						loading: 'noMore'
					}
					this.$set(this.load, current, oldLoad)
				}
				// 保存旧数组数据
				let oldList = this.listCatchData[current] || []
				oldList.push(...data)
				// 懒加载
				this.$set(this.listCatchData, current, oldList)
				// console.log(data)
			},
			// 上拉加载更多
			loadMore() {
				// noMore 不再请求数据
				if (this.load[this.activeIndex].loading === 'noMore') return
				this.load[this.activeIndex].page++
				this.getList(this.activeIndex)
			}
		},
		components: {
			listItem
		}
	}
</script>

<style lang="scss" scoped>
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
