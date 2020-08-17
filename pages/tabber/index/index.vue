<template>
	<view class="home">
		<!-- 导航栏 -->
		<navbar></navbar>
		<!-- 导航栏 -->
		<!-- tab标签栏 -->
		<tab :list="tabList" :tabIndex="tabIndex" @tabChanged="tabChanged"></tab>
		<!-- tab标签栏 -->
		<view class="home-list">
			<list :tab="tabList" :activeIndex="activeIndex" @swiperChanged="swiperChanged"></list>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	// easyCom 局部引入
	export default {
		data() {
			return {
				tabList: [],
				tabIndex: 0,
				activeIndex: 0
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		watch: {
			// 监听用户信息 userInfo 防止第一次加载时获取不到id
			userInfo(newVal) {
				this.getLabel()
			}
		},
		onLoad() {
			uni.$on('update_label',()=>{
				this.getLabel()
			})
		},
		methods: {
			// 获取标签导航栏数据
			async getLabel() {
				const {data} = await this.$api.get_label()
				data.unshift({
					name:'推荐'
				})
				this.tabList = data
				// console.log(this.tabList)
			},
			// 标签导航栏被点击改变
			tabChanged({data,index}) {
				// console.log(data,index)
				this.activeIndex = index
			},
			// 滑块视图改变 返回当前页面索引
			swiperChanged(current) {
				this.tabIndex = current
				this.activeIndex = current
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}
		
	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		.home-list {
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
