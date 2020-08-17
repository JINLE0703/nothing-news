'use strict';
const db = uniCloud.database()
// 聚合操作符
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		name,
		page = 1,
		pageSize = 6
	} = event
	let matchObj = {}
	if (name !== '推荐') {
		matchObj = {
			classify: name
		}
	}
	// 获取用户信息
	const userInfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userInfo.data[0].article_likes_ids
	
	// 聚合： 更精细化的处理数据 求和、分组、指定字段
	const list = await db.collection('article')
		.aggregate()
		// 追加字段
		.addFields({
			is_like: $.in(['$_id',article_likes_ids])
		})
		.match(matchObj)
		.project({
			content: false
		})
		// 要跳过多少条数据
		.skip(pageSize*(page-1))
		// 限制输出条数
		.limit(pageSize)
		.end()


	// 接收分类 筛选数据
	// let list = await db.collection('article')
	// 	.field({
	// 		content: false
	// 	})
	// 	.get()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
