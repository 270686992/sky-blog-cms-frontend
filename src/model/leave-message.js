/**
 * 留言业务模型
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/17 - 13:30
 */

import { get, put, _delete } from '@/lin/plugin/axios'

class LeaveMessage {
  /**
   * 根据 ID 获取留言
   *
   * @param id 留言的 ID
   * @return 返回获取的留言
   */
  static async getLeaveMessageById(id) {
    const res = await get(`v1/leave-message/${id}`)
    return res
  }

  /**
   * 根据 ID 回复留言
   *
   * @param id 留言的 ID
   * @param data 留言回复内容
   * @return 返回回复的响应结果
   */
  static async replyLeaveMessageById(id, data) {
    const res = await put(`v1/leave-message/${id}/reply`, data)
    return res
  }

  /**
   * 根据 ID 更新留言显示状态
   *
   * @param id 留言的 ID
   * @param display_state 留言的显示状态
   * @return 返回更新的响应结果
   */
  static async updateLeaveMessageDisplayStateById(id, display_state) {
    const res = await put(`v1/leave-message/display-state?id=${id}&display_state=${display_state}`)
    return res
  }

  /**
   * 根据 ID 删除留言
   *
   * @param id 留言的 ID
   * @return 返回删除的响应结果
   */
  static async deleteLeaveMessageById(id) {
    const res = await _delete(`v1/leave-message/${id}`)
    return res
  }

  /**
   * 分页获取留言列表
   *
   * @param page 当前页数
   * @param count 每页的留言数量
   * @param root 标记是否获取一级留言,1: 获取一级留言列表,0: 获取二级留言列表
   * @returns 返回当前页的留言列表
   */
  static async getLeaveMessageListByPage(page = 0, count = 10, root = 1) {
    const res = await get('v1/leave-message/page', {
      page,
      count,
      root,
    })
    return res
  }

  /**
   * 分页获取某个一级留言的子留言列表
   *
   * @param page 当前页数
   * @param count 每页的留言数量
   * @param id 父留言的 ID
   * @returns 返回当前页的子留言列表
   */
  static async getSubLeaveMessageListByPage(page = 0, count = 10, id) {
    const res = await get('v1/leave-message/sub-page', {
      page,
      count,
      id,
    })
    return res
  }
}

export default LeaveMessage
