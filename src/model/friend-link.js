/**
 * 友情链接业务模型
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/14 - 14:43
 */

import { post, get, put, _delete } from '@/lin/plugin/axios'

class FriendLink {
  /**
   * 添加友情链接
   *
   * @param data 添加的友情链接的表单数据信息
   * @return 返回添加的响应结果
   */
  static async createFriendLink(data) {
    const res = await post('v1/friend-link', data)
    return res
  }

  /**
   * 根据 ID 获取友情链接
   *
   * @param id 友情链接的 ID
   * @return 返回获取的友情链接
   */
  static async getFriendLinkById(id) {
    const res = await get(`v1/friend-link/${id}`)
    return res
  }

  /**
   * 根据 ID 更新友情链接
   *
   * @param id 友情链接的 ID
   * @param data 更新的友情链接的表单数据信息
   * @return 返回更新的响应结果
   */
  static async updateFriendLinkById(id, data) {
    const res = await put(`v1/friend-link/${id}`, data)
    return res
  }

  /**
   * 根据 ID 删除友情链接
   *
   * @param id 友情链接的 ID
   * @return 返回删除的响应结果
   */
  static async deleteFriendLinkById(id) {
    const res = await _delete(`v1/friend-link/${id}`)
    return res
  }

  /**
   * 分页获取友情链接列表
   *
   * @param page 当前页数
   * @param count 每页的友情链接数量
   * @returns 返回当前页的友情链接列表
   */
  static async getFriendLinkListByPage(page = 0, count = 10) {
    const res = await get('v1/friend-link/page', {
      page,
      count,
    })
    return res
  }
}

export default FriendLink
