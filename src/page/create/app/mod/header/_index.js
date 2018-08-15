import './_index.less'
import React, { Component } from 'react'

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header__nav">
          <div className="header__w-1200">
            <span>010-88555599</span>
            <ul>
              <li>
                <a href="https://www.catics.org/m/home.html">布丁云书手机版</a>
              </li>
              {/* <li>|</li>
              <li>
                <a href="">登录</a> /
                <a href="">注册</a>
              </li>
              <li>用户</li> */}
            </ul>
          </div>
        </div>
        <div className="header__menu">
          <div className="header__w-1200">
            <ul className="header__menu-left">
              <li>
                <a href="https://www.catics.org/home.html">
                  <img src="https://www.catics.org/edu/public/img/logo-index.png" alt="logo" />
                </a>
              </li>
              {/* <li>
                <a href="/home.html">图书</a>
              </li> */}
              <li>
                <a href="https://www.catics.org/exam/">考试</a>
              </li>
              <li>
                <a href="https://www.catics.org/competition/index.html">竞赛</a>
              </li>
              <li>
                <a href="https://www.catics.org/hr/">人才库</a>
              </li>
            </ul>
            <ul>{/* <li>搜索</li> */}</ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
