/**
 * 标签业务模型
 *
 * @author 踏雪彡寻梅
 * @date 2020/8/12 17:44
 */

import { post, get, put, _delete } from '@/lin/plugin/axios'

class Tag {
  /**
   * 添加标签
   *
   * @param data 添加的标签的表单数据信息
   * @return 返回添加的响应结果
   */
  static async createTag(data) {
    const res = await post('v1/tag', data)
    return res
  }

  /**
   * 根据 ID 获取标签
   *
   * @param id 标签的 ID
   * @return 返回获取的标签
   */
  static async getTagById(id) {
    const res = await get(`v1/tag/${id}`)
    return res
  }

  /**
   * 根据 ID 更新标签
   *
   * @param id 标签的 ID
   * @param data 更新的标签的表单数据信息
   * @return 返回更新的响应结果
   */
  static async updateTagById(id, data) {
    const res = await put(`v1/tag/${id}`, data)
    return res
  }

  /**
   * 根据 ID 删除标签
   *
   * @param id 标签的 ID
   * @return 返回删除的响应结果
   */
  static async deleteTagById(id) {
    const res = await _delete(`v1/tag/${id}`)
    return res
  }

  /**
   * 分页获取标签列表
   *
   * @param page 当前页数
   * @param count 每页的标签数量
   * @returns 返回当前页的标签列表
   */
  static async getTagListByPage(page = 0, count = 10) {
    const res = await get('v1/tag/page', {
      page,
      count,
    })
    return res
  }

  /**
   * 获取所有标签
   *
   * @return 返回包含所有标签的列表
   */
  static async getAllTagList() {
    const res = await get('v1/tag/list')
    return res
  }
}

export default Tag
