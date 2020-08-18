/**
 * 文章业务模型
 *
 * @author 踏雪彡寻梅
 * @date 2020/8/12 21:27
 */

import { post, get, put, _delete } from '@/lin/plugin/axios'

class Article {
  /**
   * 添加文章
   *
   * @param data 添加的文章的表单数据信息
   * @return 返回添加的响应结果
   */
  static async createArticle(data) {
    const res = await post('v1/article', data)
    return res
  }

  /**
   * 根据 ID 获取文章
   *
   * @param id 文章的 ID
   * @return 返回获取的文章
   */
  static async getArticleById(id) {
    const res = await get(`v1/article/${id}/detail`)
    return res
  }

  /**
   * 根据 ID 更新文章
   *
   * @param id 文章的 ID
   * @param data 更新的文章的表单数据信息
   * @return 返回更新的响应结果
   */
  static async updateArticleById(id, data) {
    const res = await put(`v1/article/${id}`, data)
    return res
  }

  /**
   * 根据 ID 删除文章
   *
   * @param id 文章的 ID
   * @return 返回删除的响应结果
   */
  static async deleteArticleById(id) {
    const res = await _delete(`v1/article/${id}`)
    return res
  }

  /**
   * 分页获取文章列表
   *
   * @param page 当前页数
   * @param count 每页的文章数量
   * @returns 返回当前页的文章列表
   */
  static async getArticleListByPage(page = 0, count = 10) {
    const res = await get('v1/article/page', {
      page,
      count,
    })
    return res
  }
}

export default Article
