import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState('');
  useEffect(() => {
    axios
  //     .get("http://localhost:8888/api/name", {
  //       params: {
  //         a: 1,
  //         b: [1, 2],
  //       },
  //     })
      .then((res) => {
        console.log(res);
        setName(res.data);
      });
  }, []);
// console.log(axios);
  return (
    <div className="App">
      {name}
    </div>
  );
}

export default App;
