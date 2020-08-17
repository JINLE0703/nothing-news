'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event
	
	const userInfo = await db.collection('user').doc(user_id).get()
	const thumbs_up_article_ids = userInfo.data[0].thumbs_up_article_ids
	
	let thumbs_up_ids = null
	if (thumbs_up_article_ids.includes(article_id)) {
		return {
			code: 200,
			msg: '您已经点过赞了'
		}
	} else {
		thumbs_up_ids = dbCmd.addToSet(article_id)
	}
	
	await db.collection('user').doc(user_id).update({
		thumbs_up_article_ids: thumbs_up_ids
	})
	
	await db.collection('article').doc(article_id).update({
		// inc 原子操作，字段自增某个值
		thumbs_up_count: dbCmd.inc(1)
	})
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '点赞成功'
	}
};
