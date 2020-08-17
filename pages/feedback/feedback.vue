<template>
	<view>
		<view class="feedback-title">意见反馈：</view>
		<!-- 文本框 -->
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
			</view>
		<view class="feedback-title">反馈图片：</view>
		<!-- 图片 -->
		<view class="feedback-image-box">
			<!-- 图片本体 -->
			<view v-for="(item,index) in imageList" :key="index" class="feedback-image-item">
				<view class="close-icon" @click="delImage(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<!-- 添加图片 -->
			<view v-if="imageList.length < 5" class="feedback-image-item" @click="addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 提交按钮 -->
		<view class="feedback-button">
			<button type="primary" @click="submit">提交反馈意见</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageList: [],
				content: ''
			}
		},
		methods: {
			// 添加图片
			addImage() {
				const count = 5 - this.imageList.length
				// 选择图片
				uni.chooseImage({
					// count 限制张数 H5中无效
					count: count,
					// 使用箭头函数 重定向this
					success:(res)=> {
						// 图片存储本地地址 数组
						const tempFilePaths = res.tempFilePaths
						
						// #ifdef H5
						const tempFiles = res.tempFiles
						tempFilePaths.forEach((item,index)=>{
							// 针对H5限制张数
							if(index<count) {
								this.imageList.push({
									url: item,
									name: tempFiles[index].name
								})
							}
						})
						// #endif
						
						// #ifndef H5
						
						tempFilePaths.forEach((item,index)=>{
							const name = item.substr(item.lastIndexOf('.', item.lastIndexOf('.') - 1) + 1)
							// 针对H5限制张数
							if(index<count) {
								this.imageList.push({
									url: item,
									name: name
								})
							}
						})
						// #endif
					}
				})
			},
			// 删除图片
			delImage(index) {
				this.imageList.splice(index,1)
			},
			// 提交反馈
			async submit() {
				let imagesPath = []
				uni.showLoading()
				for(let i = 0; i < this.imageList.length; i++) {
					const fileID = await this.uploadFiles(this.imageList[i])
					imagesPath.push(fileID)
				}
				this.updateFeedback({
					feedbackImages: imagesPath,
					content: this.content
				})

			},
			// 上传图片到云存储
			async uploadFiles(imageInfo) {
				const res = await uniCloud.uploadFile({
					filePath: imageInfo.url,
					cloudPath: imageInfo.name
				})
				return res.fileID
			},
			// 请求上传云数据库
			updateFeedback(data) {
				this.$api.update_feedback(data).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title:'反馈提交成功',
						icon: 'none'
					})
					// 成功2s后跳回个人中心
					setTimeout(()=>{
						uni.switchTab({
							url: '/pages/tabber/my/my'
						})
					},2000)
				}).catch(()=>{
					uni.hideLoading()
					uni.showToast({
						title:'反馈提交失败',
						icon: 'none'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feedback-title {
		margin: 15px;
		margin-bottom: 0;
		font-size: 14px;
		color: #666;
	}
	
	.feedback-content {
		margin: 15px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px #eee solid;
		
		.feedback-textarea {
			font-size: 12px;
			width: 100%;
			height: 100px;
		}
	}
	
	.feedback-image-box {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		
		.feedback-image-item {
			position: relative;
			width: 33.33%;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;
			
			.close-icon{
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 0;
				top: 0;
				width: 22px;
				height: 22px;
				border-radius: 50%;
				background-color: #ff5a5f;
				z-index: 2;
			}
			
			.image-box {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 5px;
				right: 5px;
				bottom: 5px;
				left: 5px;
				border: 1px #eee solid;
				border-radius: 5px;
				overflow: hidden;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.feedback-button {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		
		button {
			margin: 15px;
			background-color: $mk-base-color;
		}
	}
</style>
