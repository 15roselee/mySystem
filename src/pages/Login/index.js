import React, { Component,useState } from 'react';
import './index.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


export default function Login(){

  const [username, setUserName]=useState([]);
  const [password, setPassword]=useState([]);
 

  const onSubmit = (e) => {
    e.preventDefault();
    register()
    // if (this.state.username==='张三'&&this.state.password==='111') {
    //   // queryShops();
    //   e.preventDefault();
      
    // }
 console.log(username);
 console.log(password);
  };
  // 取输入框的值
  const changeHandle=(e)=>{
   
    setUserName(e.target.value)
    
  }
  const changeHandle2=(e)=>{
   
    setPassword(e.target.value)
  } 

  function register() {
    axios
      .post(
        'http://localhost:9102/landing/register',
      {
        id:1
      }
      )
      .then(res => {
        console.log(res);
        setUserName(res.data.registerId);
        setPassword(res.data.registerPassword);
      });
  }

    return (
      <div className="bgc">
      <div className='content'>
        <form onSubmit={onSubmit}>
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
              onChange={changeHandle}
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
              onChange={changeHandle2}
             

            ></input>
          </div>

          <div className="form-group">
            <button className="button">注&nbsp;&nbsp;册</button>
          </div>
          <p>tips:请保管好你的密码！</p>
        </form>
      </div>
      </div>
    );
  


}


