/**
 * 文章分类业务模型
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/12 - 14:13
 */

import { post, get, put, _delete } from '@/lin/plugin/axios'

class Category {
  /**
   * 添加文章分类
   *
   * @param data 添加的文章分类的表单数据信息
   * @return 返回添加的响应结果
   */
  static async createCategory(data) {
    const res = await post('v1/category', data)
    return res
  }

  /**
   * 根据 ID 获取文章分类
   *
   * @param id 文章分类的 ID
   * @return 返回获取的文章分类
   */
  static async getCategoryById(id) {
    const res = await get(`v1/category/${id}`)
    return res
  }

  /**
   * 根据 ID 更新文章分类
   *
   * @param id 文章分类的 ID
   * @param data 更新的文章分类的表单数据信息
   * @return 返回更新的响应结果
   */
  static async updateCategoryById(id, data) {
    const res = await put(`v1/category/${id}`, data)
    return res
  }

  /**
   * 根据 ID 删除文章分类
   *
   * @param id 文章分类的 ID
   * @return 返回删除的响应结果
   */
  static async deleteCategoryById(id) {
    const res = await _delete(`v1/category/${id}`)
    return res
  }

  /**
   * 分页获取文章分类列表
   *
   * @param page 当前页数
   * @param count 每页的文章分类数量
   * @returns 返回当前页的文章分类列表
   */
  static async getCategoryListByPage(page = 0, count = 10) {
    const res = await get('v1/category/page', {
      page,
      count,
    })
    return res
  }

  /**
   * 获取所有文章分类
   *
   * @return 返回包含所有文章分类的列表
   */
  static async getAllCategoryList() {
    const res = await get('v1/category/list')
    return res
  }
}

export default Category
