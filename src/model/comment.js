/**
 * 文章评论业务模型
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/15 - 14:22
 */

import { get, put, _delete } from '@/lin/plugin/axios'

class Comment {
  /**
   * 根据 ID 获取文章评论
   *
   * @param id 文章评论的 ID
   * @return 返回获取的文章评论
   */
  static async getCommentById(id) {
    const res = await get(`v1/comment/${id}`)
    return res
  }

  /**
   * 根据 ID 回复文章评论
   *
   * @param id 文章评论的 ID
   * @param data 文章评论回复内容
   * @return 返回回复的响应结果
   */
  static async replyCommentById(id, data) {
    const res = await put(`v1/comment/${id}/reply`, data)
    return res
  }

  /**
   * 根据 ID 更新文章评论显示状态
   *
   * @param id 文章评论的 ID
   * @param display_state 文章评论的显示状态
   * @return 返回更新的响应结果
   */
  static async updateCommentDisplayStateById(id, display_state) {
    const res = await put(`v1/comment/display-state?id=${id}&display_state=${display_state}`)
    return res
  }

  /**
   * 根据 ID 删除文章评论
   *
   * @param id 文章评论的 ID
   * @return 返回删除的响应结果
   */
  static async deleteCommentById(id) {
    const res = await _delete(`v1/comment/${id}`)
    return res
  }

  /**
   * 分页获取文章评论列表
   *
   * @param page 当前页数
   * @param count 每页的文章评论数量
   * @param root 标记是否获取一级文章评论,1: 获取一级文章评论列表,0: 获取二级文章评论列表
   * @returns 返回当前页的文章评论列表
   */
  static async getCommentListByPage(page = 0, count = 10, root = 1) {
    const res = await get('v1/comment/page', {
      page,
      count,
      root,
    })
    return res
  }

  /**
   * 分页获取某个一级文章评论的子评论列表
   *
   * @param page 当前页数
   * @param count 每页的文章评论数量
   * @param id 父评论的 ID
   * @returns 返回当前页的子评论列表
   */
  static async getSubCommentListByPage(page = 0, count = 10, id) {
    const res = await get('v1/comment/sub-page', {
      page,
      count,
      id,
    })
    return res
  }
}

export default Comment
