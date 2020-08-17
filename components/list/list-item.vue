<template>
	<list-scroll @loadMore="loadMore">
		<view>
			<list-card v-for="item in list" :key="item._id" :item="item"></list-card>
		</view>
		<uni-load-more v-if="list.length === 0 || list.length > 5" iconType="snow" :status="load.loading || 'loading'"></uni-load-more>
	</list-scroll>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default() {
					return []
				}
			},
			load: {
				type: Object,
				default() {
					return {
						loading: 'loading'
					}
				}
			}
		},
		methods: {
			loadMore() {
				this.$emit('loadMore')
			}
		}
	}
</script>

<style>
</style>
