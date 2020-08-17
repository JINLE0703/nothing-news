'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command

exports.main = async (event, context) => {
	const {
		user_id,
		article_id,
		content, // 发布内容
		comment_id = '', // 被评论的评论id
		reply_id = '', // 子回复id
		is_reply = false // 是否子回复
	} = event

	// 获取用户信息
	let userInfo = await db.collection('user').doc(user_id).get()
	userInfo = userInfo.data[0]
	// 获取当前文章信息
	const articleInfo = await db.collection('article').doc(article_id).get()
	// 获取文章所有评论
	const comments = articleInfo.data[0].comments

	// 评论内容
	let commentObj = {
		comment_id: genID(5), // 评论内容id
		comment_content: content, // 评论内容
		create_time: new Date().getTime(), // 创建时间
		is_reply: is_reply, // 区分主回复/子回复
		author: {
			author_id: userInfo._id, // 作者id
			author_name: userInfo.author_name, // 作者名称
			avatar: userInfo.avatar, // 作者头像
			professional: userInfo.professional //作者的专业
		},
		replys: [] // 评论字段
	}

	if (comment_id === '') {
		// 评论文章
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	} else {
		// 回复评论
		// 获取评论的索引
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)
		
		let commentAuthor = ''
		if(is_reply) {
			// 子回复
			commentAuthor = comments[commentIndex].replys.find(item=>item.comment_id === reply_id)
			commentAuthor = commentAuthor.author.author_name
		} else {
			// 主回复
			// 获取评论作者信息
			commentAuthor = comments.find(item => item.comment_id === comment_id)
			commentAuthor = commentAuthor.author.author_name
		}
		// to 为被回复作者的名字
		commentObj.to = commentAuthor
		
		// 更新回复信息
		commentObj = {
			[commentIndex]: {
				replys: dbCmd.unshift(commentObj)
			}
		}
	}

	// 更新评论
	await db.collection('article').doc(article_id).update({
		comments: commentObj
	})

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据更新成功'
	}
};

// 获取随机id
function genID(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}
