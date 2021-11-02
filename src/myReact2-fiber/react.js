function createElement(type, props, ...children) {
  if (props) {
    Reflect.deleteProperty(props, "__self");
    Reflect.deleteProperty(props, "__source");
  }

  // console.log(type)
  // console.log(props)
  // console.log(children)

  return {
    type,
    props: {
      ...props,
      // children: children,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextNode(child)
      ),
    },
  };
}

function createTextNode(text) {
  // console.log(text);
  return {
    type: "TEXT",
    props: {
      children: [],
      nodeValue: text,
    },
  };
}

export default {
  createElement,
};
