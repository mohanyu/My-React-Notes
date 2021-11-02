// 官方的 引用
// import React from 'react';
// import ReactDOM from 'react-dom';

// 自己写的 react核心API 和 react-render方法
// import React from "./myReact/react";
// import ReactDOM from "./myReact/react-dom";
// import Componet from "./myReact/Componet";

// 
import React from "./myReact2-fiber/react";
import ReactDOM from "./myReact2-fiber/react-dom";
import Componet from "./myReact2-fiber/Componet";

import "./index.css";

function FunctionComponent(props) {
  const { name, age } = props;
  return (
    <div>
      {`hello my name is ${name}, age${age}`}
      <button onClick={() => console.log("点击了")}>点击函数组件</button>
    </div>
  );
}

class ClassComponent extends Componet {
  // static defaultProps = {
  //   componentName: "ClassComponent age",
  // };

  render() {
    const { name } = this.props;
    return (
      <div className="border">
        {/* {`ClassComponent name is ${name} ${componentName}`} */}
        {`ClassComponent name is ${name}`}
      </div>
    );
  }
}

const jsx = (
  <div className="border">
    <p style={{ color: "red" }}>123</p>
    <a href="www.baidu.com">123</a>

    <FunctionComponent name="mohanyu" age="18" />
    <ClassComponent name="Componet" age="18" />
    <>
      <h1>Fragment</h1>
    </>
    {/* 
    {[1, 2, 3].map((item) => {
      return (
        <div className="border" key={item}>
          <p>{item}</p>
          <p>{item}</p>
        </div>
      );
    })} */}
  </div>
);

ReactDOM.render(
  // React.createElement(div, {}, `<p>123</p>`),
  jsx,
  document.getElementById("root")
);
