import React, { Component } from 'react';
import './index.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios'

export default class Logon extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.username);
    console.log(this.state.password);
    console.log(this.state);
  };
  changeHandle=(e)=>{
    this.setState({
      [e.target.name]:e.target.value,
      // password:e.target.value
    })
  }
// axios.post(
//   `http://localhost:9102/shop/${shop.businessNo}/close`
//   headers: {
//     tenantId: 500,
//     userId: 11000,
//   },
// )



  render() {
    const { username, password } = this.state;
    return (
      <div className="bgc">
      <div className='content'>
        <form onSubmit={this.onSubmit}>
          <h1>点单系统</h1>
          <div className="line"></div>
          <div className="form-group">
            <label className="control-label"><UserOutlined  style={{               
                fontSize:'30px'
              }}/></label>
            <input
              className="form-control"
              type="text"
              name="username"
              value={username}
              onChange={this.changeHandle}
            ></input>
          </div>

          <div className="form-group">
            <label className="control-label"><LockOutlined  style={{           
                fontSize:'30px'
              }}/></label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={password}
              onChange={this.changeHandle}
             

            ></input>
          </div>

          <div className="form-group">
            <button className="button">登&nbsp;&nbsp;录</button>
          </div>
          <p>tips:请勿多次登录！</p>
        </form>
      </div>
      </div>
    );
  }



  
}
