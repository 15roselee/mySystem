import React, { Component,useState } from 'react';
import './index.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate ,Redirect} from 'react-router-dom';
import { message } from 'antd';
import Home from "../Home";


export default function Login(){

  const [username, setUserName]=useState([]);
  const [password, setPassword]=useState([]);
  const [buttonName,setButtonName]=useState();
 
// 注册
  const onSubmit = (e) => {
    e.preventDefault();
    requestRegister()
// if (condition) {
  
// }
 console.log(username);
 console.log(password);
 console.log(buttonName);
//  console.log(bbb);

console.log("form");

  };
// 登录
  const onClick=(e)=>{
    e.preventDefault();
    requestLogin()

  }
 
  // 取输入框的值
  const changeHandle=(e)=>{
   
    setUserName(e.target.value)
    
  }
  const changeHandle2=(e)=>{
   
    setPassword(e.target.value)
  } 

  const handel=(e)=>{
    setButtonName(e.target.Component)
  }

  // function register() {
  //   axios
  //     .post(
    // 登录
  //       'http://localhost:9102/landing/login',
  //     {
  //       id:1
  //     }
  //     )
  //     .then(res => {
  //       console.log(res);
  //       setUserName(res.data.registerId);
  //       setPassword(res.data.registerPassword);
  //     });
  // }


  // 注册请求
  function requestRegister(condition) {
  axios.post('http://localhost:9102/landing/register', {
    condition,
    registerId: username,
    registerPassword: password,
  })
  .then(function (response) {
    console.log(response);
    message.success('注册成功')
  })
  .catch(function (error) {
    // console.log(error);
    message.error('注册失败');
  });
}
let navigate = useNavigate();
// 登录请求
function requestLogin(condition) {
  

  axios.post('http://localhost:9102/landing/login', {
    condition,
    registerId: username,
    registerPassword: password,
  })
  .then(function (response) {
    console.log(response);
    console.log(response.data)

    if (response.data == "登录成功") {
      
      message.success('登录成功')
      // 页面跳转到home页
      // window.location.href=< Home/>
      // return <Redirect to={{pathname:"../home"}} />
     
  //     const {history}=this.props
  // history.push(".page/home")
  //     history.go()

    }else{
      message.error('登录失败');
    }
    // <Home/>
  })
  .catch(function (error) {
    console.log(error);
    // message.error('登录失败');
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
            <button className="button" value={buttonName}>注&nbsp;&nbsp;册</button>
            <button className="login" onClick={onClick}>登&nbsp;&nbsp;录</button>
          </div>
          <p>tips:请保管好你的密码！</p>
        </form>
      </div>
      </div>
    );
  


}


