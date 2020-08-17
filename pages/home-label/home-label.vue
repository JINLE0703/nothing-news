<template>
	<view class="label">
		<!-- 我的标签 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<uni-icons v-if="!is_edit" type="gear" size="18" color="#666" @click="editLabel"></uni-icons>
				<view v-else class="label-edit" @click="editLabel">完成</view>
			</view>
			<view class="label-content">
				<view v-for="(item,index) in labelList" :key="item._id" class="label-content-item">
					{{item.name}}
					<uni-icons v-if="is_edit" class="icons-close" type="clear" size="20" color="red" @click="removeLabel(index)"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 推荐 -->
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<view class="label-content">
				<view v-for="(item,index) in recommendList" :key="item._id" class="label-content-item">
					{{item.name}}
					<uni-icons v-if="is_edit" class="icons-close" type="plus-filled" size="20" color="#30b33a" @click="addLabel(index)"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				// 我的标签
				labelList: [],
				// 推荐标签
				recommendList: []
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			// 编辑标签
			editLabel() {
				if(this.is_edit) {
					// 编辑完成
					this.is_edit = false
					this.updateLabel(this.labelList)
				} else {
					// 正在编辑
					this.is_edit = true
				}
			},
			// 获取标签数据
			async getLabel() {
				const {data} = await this.$api.get_label({
					type: 'all'
				})
				// 获取 current 为 true 即为 我的标签 的数据
				this.labelList = data.filter(item=>item.current)
				// 获取 current 为 false 即为 推荐标签 的数据
				this.recommendList = data.filter(item=>!item.current)
			},
			// 点击删除标签
			removeLabel(index) {
				this.recommendList.push(this.labelList[index])
				this.labelList.splice(index,1)
			},
			// 点击添加标签
			addLabel(index) {
				this.labelList.push(this.recommendList[index])
				this.recommendList.splice(index,1)
			},
			// 更新标签
			async updateLabel(label) {
				// 更新后 我的标签 的标签 id 数组
				let labelIds = []
				label.forEach(item=> {
					labelIds.push(item._id)
				})
				uni.showLoading()
				await this.$api.update_label({
					label: labelIds
				})
				uni.showToast({
					title:'更新成功',
					icon:'none'
				})
				uni.hideLoading()
				uni.$emit('update_label')
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
	}
	
	.label {
		.label-box {
			background-color: #fff;
			margin-bottom: 10px;
			
			.label-header {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px;
				height: 20px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;
				
				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}
				
			}
			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;
				
				.label-content-item {
					position: relative;
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;
					
					.icons-close {
						position: absolute;
						right: -11px;
						top: -11px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}
</style>
