'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event

	// 获取用户信息
	const userInfo = await db.collection('user').doc(user_id).get()
	// 获取用户喜欢列表信息
	const article_id_ids = userInfo.data[0].article_likes_ids
	let updateFunc = null
	// 判断用户喜欢列表是否有更新文章
	if (article_id_ids.includes(article_id)) {
		// dbCmd.pull 将数组中所有匹配给定值或查询条件的元素都移除掉
		updateFunc = dbCmd.pull(article_id)
	} else {
		// dbCmd.addToSet 给定一个或多个元素，除非数组中已存在该元素，否则添加进数组
		updateFunc = dbCmd.addToSet(article_id)
	}

	await db.collection('user').doc(user_id).update({
		article_likes_ids: updateFunc
	})
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: userInfo.data[0]
	}
};
