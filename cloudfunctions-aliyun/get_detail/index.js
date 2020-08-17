'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event
	
	// 获取用户信息
	let userInfo = await db.collection('user').doc(user_id).get()
	userInfo = userInfo.data[0]
	// 聚合
	let list = await db.collection('article')
		.aggregate()
		.addFields({
			// 是否关注作者
			is_author_lile: $.in(['$author.id',userInfo.author_likes_ids]),
			// 是否收藏文章
			is_like: $.in(['$_id',userInfo.article_likes_ids]),
			// 是否点赞
			is_thumbs_up: $.in(['$_id',userInfo.thumbs_up_article_ids])
		})
		// 筛选
		.match({
			_id: article_id
		})
		// 过滤
		.project({
			coments: false
		})
		.end()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data[0]
	}
};
