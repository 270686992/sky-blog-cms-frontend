/**
 * 站点信息业务模型
 *
 * @作者 踏雪彡寻梅
 * @创建时间 2020/8/18 - 17:34
 */

import { post, get, put, _delete } from '@/lin/plugin/axios'

class WebSiteInfo {
  /**
   * 添加站点信息
   *
   * @param data 添加的站点信息的表单数据信息
   * @return 返回添加的响应结果
   */
  static async createWebSiteInfo(data) {
    const res = await post('v1/web-site-info', data)
    return res
  }

  /**
   * 根据 ID 获取站点信息
   *
   * @param id 站点信息的 ID
   * @return 返回获取的站点信息
   */
  static async getWebSiteInfoById(id) {
    const res = await get(`v1/web-site-info/${id}`)
    return res
  }

  /**
   * 根据 ID 更新站点信息
   *
   * @param id 站点信息的 ID
   * @param data 更新的站点信息的表单数据信息
   * @return 返回更新的响应结果
   */
  static async updateWebSiteInfoById(id, data) {
    const res = await put(`v1/web-site-info/${id}`, data)
    return res
  }

  /**
   * 根据 ID 删除站点信息
   *
   * @param id 站点信息的 ID
   * @return 返回删除的响应结果
   */
  static async deleteWebSiteInfoById(id) {
    const res = await _delete(`v1/web-site-info/${id}`)
    return res
  }

  /**
   * 获取所有站点信息
   *
   * @returns 返回所有站点信息的列表
   */
  static async getAllWebSiteInfoList() {
    const res = await get('v1/web-site-info/list')
    return res
  }
}

export default WebSiteInfo
