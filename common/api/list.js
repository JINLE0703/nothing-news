import $http from '../js/http.js'

// 获取标签
export const get_label = (data) => {
	return $http({
		url: 'get_label',
		data
	})
}

// 获取文章列表
export const get_list = (data) => {
	return $http({
		url: 'get_list',
		data
	})
}

// 更新喜欢内容
export const update_likes = (data) => {
	return $http({
		url: 'update_likes',
		data
	})
}

// 获取搜索文章列表
export const get_search = (data) => {
	return $http({
		url: 'get_search',
		data
	})
}

// 更新标签
export const update_label = (data) => {
	return $http({
		url: 'update_label',
		data
	})
}

// 获取文章详情
export const get_detail = (data) => {
	return $http({
		url: 'get_detail',
		data
	})
}

// 更新发布评论
export const update_comment = (data) => {
	return $http({
		url: 'update_comment',
		data
	})
}

// 获取评论信息
export const get_comments = (data) => {
	return $http({
		url: 'get_comments',
		data
	})
}

// 更新关注作者
export const update_author = (data) => {
	return $http({
		url: 'update_author',
		data
	})
}

// 更新点赞文章
export const update_thumbsup = (data) => {
	return $http({
		url: 'update_thumbsup',
		data
	})
}

// 获取收藏内容
export const get_follow = (data) => {
	return $http({
		url: 'get_follow',
		data
	})
}

// 获取关注作者
export const get_author = (data) => {
	return $http({
		url: 'get_author',
		data
	})
}

// 获取我的信息
export const get_user = (data) => {
	return $http({
		url: 'get_user',
		data
	})
}

// 获取我的文章
export const get_my_article = (data) => {
	return $http({
		url: 'get_my_article',
		data
	})
}

// 上传反馈
export const update_feedback = (data) => {
	return $http({
		url: 'update_feedback',
		data
	})
}