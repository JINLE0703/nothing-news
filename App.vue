<script>
	export default {
		onLaunch: async function() {
			// 模拟已经登陆
			// 获取我的用户信息
			const {
				data
			} = await this.$api.get_user({
				user_id: '5f3a76f98142e4000188f497'
			})
			this.$store.dispatch('setUserInfo', data)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* 引用插件样式 */
	@import 'components/gaoyia-parse/parse.css';

	page {
		height: 100%;
	}
</style>
