/**
 * 博客用户业务模型
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/18 - 14:28
 */

import { get, put } from '@/lin/plugin/axios'

class Customer {
  /**
   * 根据 ID 获取博客用户
   *
   * @param id 博客用户的 ID
   * @return 返回获取的博客用户
   */
  static async getCustomerById(id) {
    const res = await get(`v1/customer/${id}`)
    return res
  }

  /**
   * 根据 ID 更新博客用户的状态(冻结、解封)
   *
   * @param id 博客用户的 ID
   * @param state 博客用户的状态
   * @return 返回更新的响应结果
   */
  static async updateCustomerStateById(id, state) {
    const res = await put(`v1/customer/state?id=${id}&state=${state}`)
    return res
  }

  /**
   * 分页获取博客用户列表
   *
   * @param page 当前页数
   * @param count 每页的博客用户数量
   * @returns 返回当前页的博客用户列表
   */
  static async getCustomerListByPage(page = 0, count = 10) {
    const res = await get('v1/customer/page', { page, count })
    return res
  }

  /**
   * 按查询关键字分页搜索博客用户列表
   *
   * @param page 当前页数
   * @param count 每页的博客用户数量
   * @param keyword 查询关键字
   * @return 返回搜索的当前页的博客用户列表
   */
  static async searchCustomerList({ page, count, keyword }) {
    const res = await get('v1/customer/search', {
      page,
      count,
      keyword
    })
    return res
  }
}

export default Customer
