// vuex 状态管理

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	// 数据源
	state: {
		// 登陆用户信息
		userInfo: uni.getStorageSync('__userInfo') || {},
		// 搜索历史记录
		historyList: uni.getStorageSync('__history') || []
	},
	mutations: {
		set_User_Info(state,userInfo) {
			state.userInfo = userInfo
		},
		set_History_List(state,history) {
			state.historyList = history
		},
		clear_History_List(state) {
			state.historyList = []
		}
	},
	actions: {
		setUserInfo({commit},userInfo) {
			uni.setStorageSync('__userInfo',userInfo)
			commit('set_User_Info',userInfo)
		},
		setHistory({commit,state},history) {
			let list = state.historyList
			list.unshift(history)
			uni.setStorageSync('__history',list)
			commit('set_History_List',list)
		},
		clearHistory({commit}) {
			uni.removeStorageSync('__history')
			commit('clear_History_List')
		}
	}
})

export default store
