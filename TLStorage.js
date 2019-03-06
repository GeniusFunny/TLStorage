class TLStorage {
  // 存储数据，time为数据有效时间，默认为1天
  static setItem(key, value, time) {
    time = time > 0 ? time * 1000 : 24 * 3600 * 1000
    let wrapItem = TLStorage.wrapValue(value, time) //  包装数据项
    localStorage.setItem(key, JSON.stringify(wrapItem)) // 将包装后的数据项存入storage
    TLStorage.autoDelete(key, time) //  触发一个自动删除的timeout，适用于超短有效期并且标签页可能会关闭的情况下
  }
  //  定时删除函数
  static autoDelete(key, time) {
    setTimeout(() => {
      localStorage.removeItem(key)
    }, time)
  }
  //  包装函数，待优化
  static wrapValue(value, time) {
    return {
      value: value,
      expireTime: Date.now() + time
    }
  }
  //  获取数据；先判断是否过期，过期就删除
  static getItem(key) {
    let now = Date.now()
    let wrapItem = localStorage.getItem(key)
    if (wrapItem) {
      wrapItem = JSON.parse(wrapItem)
    }
    if (parseInt(wrapItem.expireTime) < now) {
      TLStorage.removeItem(key)
      return null
    } else {
      return wrapItem.value
    }
  }
  //  清除所有的数据
  static clear() {
    localStorage.clear()
  }
  //  删除指定数据
  static removeItem(key) {
    localStorage.removeItem(key)
  }
}
