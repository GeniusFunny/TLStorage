/**
 *
 * @param name，属性名称
 * @param value，属性值
 * @param type，属性类型
 */
function isCorrectType(name, value, type) {
  if (typeof value !== type && (type === 'array' && !Array.isArray(value))) {
    throw new Error(`${name} is must be ${type}`)
  }
}
/**
 * TLStorge, 有效期版LocalStorage
 */
class TLStorage {
  /**
   * 存储数据
   * @param key
   * @param value
   * @param time，过期时间
   */
  static setItem(key, value, time) {
    try {
      isCorrectType('key', key, 'string')
      isCorrectType('time', time, 'number')
    } catch (e) {
      throw new Error(`参数错误, ${e}`)
    }
    time = time > 0 ? time * 1000 : 24 * 3600 * 1000
    const wrapItem = TLStorage.wrapValue(value, time)
    localStorage.setItem(key, JSON.stringify(wrapItem))
    // 触发一个自动删除的timeout，适用于有效期较短并且标签页可能会关闭的情况下
    TLStorage.autoDelete(key, time)
  }

  /**
   * 定时删除数据
   * @param key
   * @param time
   */
  static autoDelete(key, time) {
    setTimeout(() => {
      localStorage.removeItem(key)
    }, time)
  }

  /**
   * 包装数据项，增加过期时间
   * @param value
   * @param time
   * @returns {{expireTime: *, value: *}}
   */
  static wrapValue(value, time) {
    return {
      value: value,
      expireTime: Date.now() + time
    }
  }

  /**
   * 获取数据项，在这里进行数据过滤
   * @param key
   * @returns {*}
   */
  static getItem(key) {
    let now = Date.now() // 读取时间
    let wrapItem = localStorage.getItem(key)
    if (wrapItem) {
      wrapItem = JSON.parse(wrapItem)
    }
    // 读取时间与过期时间进行比较，如果过期则返回null，否则返回value
    if (parseInt(wrapItem.expireTime) <= now) {
      TLStorage.removeItem(key)
      return null
    } else {
      return wrapItem.value
    }
  }

  /**
   * 清除所有数据项
   */
  static clear() {
    localStorage.clear()
  }

  /**
   * 删除数据项
   * @param key
   */
  static removeItem(key) {
    localStorage.removeItem(key)
  }
}
