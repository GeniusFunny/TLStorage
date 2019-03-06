"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TLStorage =
  /*#__PURE__*/
  function () {
    function TLStorage() {
      _classCallCheck(this, TLStorage);
    }

    _createClass(TLStorage, null, [{
      key: "setItem",
      // 存储数据，time为数据有效时间，默认为1天
      value: function setItem(key, value, time) {
        time = time > 0 ? time * 1000 : 24 * 3600 * 1000;
        var wrapItem = TLStorage.wrapValue(value, time); //  包装数据项

        localStorage.setItem(key, JSON.stringify(wrapItem)); // 将包装后的数据项存入storage

        TLStorage.autoDelete(key, time); //  触发一个自动删除的timeout，适用于超短有效期并且标签页可能会关闭的情况下
      } //  定时删除函数

    }, {
      key: "autoDelete",
      value: function autoDelete(key, time) {
        setTimeout(function () {
          localStorage.removeItem(key);
        }, time);
      } //  包装函数，待优化

    }, {
      key: "wrapValue",
      value: function wrapValue(value, time) {
        return {
          value: value,
          expireTime: Date.now() + time
        };
      } //  获取数据；先判断是否过期，过期就删除

    }, {
      key: "getItem",
      value: function getItem(key) {
        var now = Date.now();
        var wrapItem = localStorage.getItem(key);

        if (wrapItem) {
          wrapItem = JSON.parse(wrapItem);
        }

        if (parseInt(wrapItem.expireTime) < now) {
          TLStorage.removeItem(key);
          return null;
        } else {
          return wrapItem.value;
        }
      } //  清除所有的数据

    }, {
      key: "clear",
      value: function clear() {
        localStorage.clear();
      } //  删除指定数据

    }, {
      key: "removeItem",
      value: function removeItem(key) {
        localStorage.removeItem(key);
      }
    }]);

    return TLStorage;
  }();
