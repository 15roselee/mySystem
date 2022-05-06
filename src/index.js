import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Detail from "./pages/Detail";
// import List from "./pages/List";
import Home from "./pages/Home";
// import PoiManageDetail from "./pages/PoiManage/Detail";
// import PoiManageList from "./pages/PoiManage/List";
import "antd/dist/antd.css";
 import Login from "./pages/Login"
 import Sign_in from "./pages/Login/sign_in"



// const routeConfig = [
//   {
//     path: '/',
//     element: Home,
//   }
// ]

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Login />
    <Sign_in />
      <Home />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();