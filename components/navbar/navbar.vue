<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight+'px'}"></view>
			<!-- 导航栏 -->
			<view class="navbar-content" :class="{search:isSearch}" :style="{height: navbarHeight+'px', width: windowWidth+'px'}">
				<!-- 返回箭头 -->
				<view v-if="isSearch" class="navbar-content-search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<!-- 非搜索页显示 -->
				<view v-if="!isSearch" class="navbar-search" @click="goSearch">
					<view class="navbar-search-icon">
						<uni-icons type="search" size="18" color="#999"></uni-icons>
					</view>
					<view class="navbar-search-text">uni-app、vue</view>
				</view>
				<!-- 搜索页显示 -->
				<view v-else class="navbar-search">
					<input class="navbar-search-text" type="text" v-model="searchVal" placeholder="请输入搜索内容" @input="inputChanged" />
				</view>
			</view>
		</view>
		<!-- 导航占位栏 -->
		<view :style="{height: navbarHeight+statusBarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			isSearch: {
				type: Boolean,
				default: false
			},
			value: {
				type: [String,Number],
				default: ''
			}
		},
		data() {
			return {
				// 状态栏高度
				statusBarHeight: 20,
				navbarHeight: 45,
				windowWidth: 375,
				// 搜索内容
				searchVal: ''
			};
		},
		watch: {
			value(newVal) {
				this.searchVal = newVal
			}
		},
		created() {
			// 获取手机系统信息
			const phoneInfo = uni.getSystemInfoSync()
			// 设置屏幕宽度
			this.windowWidth = phoneInfo.windowWidth
			// 设置状态栏高度
			this.statusBarHeight = phoneInfo.statusBarHeight

			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 获取微信小程序胶囊位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// 导航栏高度 = (胶囊底部高度 - 状态栏高度) + (胶囊顶部高度 - 状态栏高度)
			this.navBarHeight = (menuButtonInfo.bottom - phoneInfo.statusBarHeight) + (menuButtonInfo.top - phoneInfo.statusBarHeight)
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods: {
			// 跳转搜索页面
			goSearch() {
				uni.navigateTo({
					url: '/pages/home-search/home-search'
				})
			},
			// 搜索框内容改变
			inputChanged() {
				this.$emit('input',this.searchVal)
			},
			// 返回首页
			back() {
				uni.switchTab({
					url: '/pages/tabber/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 999;
			width: 100%;
			background-color: $mk-base-color;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				height: 45px;
				box-sizing: border-box;
				
				.navbar-search {
					display: flex;
					align-items: center;
					padding: 0 10px;
					width: 100%;
					height: 30px;
					background-color: #fff;
					border-radius: 30px;

					.navbar-search-icon {
						margin-right: 10px;
					}

					.navbar-search-text {
						width: 100%;
						font-size: 14px;
						color: #999;
					}
				}
				
				&.search {
					padding-left: 0;
					.navbar-content-search-icons {
						margin: 0 10px;
					}
					.navbar-search {
						border-radius: 5px;
					}
				}
			}
		}
	}
</style>
