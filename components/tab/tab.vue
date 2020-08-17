<template>
	<view class="tab">
		<scroll-view class="tab-scroll" scroll-x>
			<view class="tab-scroll-box">
				<view v-for="(item,index) in list" :key="item._id" class="tab-scroll-item" :class="activeIndex === index ? 'tab-scroll-item-active' : ''"
				 @click="clickTab(item,index)">{{item.name}}</view>
			</view>
		</scroll-view>
		<view class="tab-icon" @click="open">
			<uni-icons type="gear" size="26" color="#666"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				// 被选中标签下标
				activeIndex: 0
			}
		},
		watch: {
			tabIndex(newVal, oldVal) {
				this.activeIndex = newVal
			}
		},
		methods: {
			// 点击标签
			clickTab(item, index) {
				this.activeIndex = index
				this.$emit('tabChanged', {
					data: item,
					index: index
				})
			},
			// 编辑标签
			open() {
				uni.navigateTo({
					url: '/pages/home-label/home-label'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab {
		display: flex;
		width: 100%;
		border-bottom: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;

		.tab-scroll {
			flex: 1;
			overflow: hidden;
			box-sizing: border-box;

			.tab-scroll-box {
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
				height: 45px;
				box-sizing: border-box;

				.tab-scroll-item {
					flex-shrink: 0;
					padding: 0 10px;
					color: #333;
					font-size: 14px;

					&.tab-scroll-item-active {
						color: $mk-base-color
					}
				}
			}
		}

		.tab-icon {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 45px;

			&::after {
				content: '';
				position: absolute;
				top: 12px;
				bottom: 12px;
				left: 0;
				width: 1px;
				background-color: #ddd;
			}
		}
	}
</style>
