import { PLACEMENT, DELETIONS, UPDATE } from "./CONST";

// 下一个子任务
let nextUnitOfWork = null;

// work in progress 工作中的 fiber root
let wipRoot = null;

// 现在的根节点
let currentRoot = null;

// render 外部调用
// ReactDOM.render( jsx, document.getElementById('root');

function render(vnode, container) {
  // console.log(vnode, "----", container);
  // 根据vnode-> 创建node
  wipRoot = {
    node: container, // 需要挂载的根节点
    props: { children: [vnode] },
    base: currentRoot, // 旧的 fiber 树
  };
  console.log("vnode", vnode);
  console.log("wipRoot", wipRoot);
  nextUnitOfWork = wipRoot;
}

/**
   window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。
      这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。
      函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序。
      你可以在空闲回调函数中调用requestIdleCallback() ，以便在下一次通过事件循环之前调度另一个回调。

  var handle = window.requestIdleCallback(callback[, options])

  参数：     callback
                一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 IdleDeadline 的参数，
                这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。

  可选参数：  options


  返回：      一个ID，可以把它传入 Window.cancelIdleCallback() 方法来结束回调。
 */

requestIdleCallback(workLoop);

/**
  // callback 函数会接收到一个名为 IdleDeadline 的参数，
  //           这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。
  // 参数: IdleDeadline;

  // IdleDeadline.didTimeout() 一个Boolean类型
  //                            当它的值为true的时候说明callback正在被执行(并且上一次执行回调函数执行的时候由于时间超时回调函数得不到执行) ，.
  //                            因为在执行requestIdleCallback回调的时候指定了超时时间并且时间已经超时。
  // IdleDeadline.timeRemaining()
  //
  //                            返回一个时间DOMHighResTimeStamp,
  //                            并且是浮点类型的数值，它用来表示当前闲置周期的预估剩余毫秒数。
  //                            如果idle period已经结束，则它的值是0。你的回调函数(传给requestIdleCallback的函数)
  //                            可以重复的访问这个属性用来判断当前线程的闲置时间是否可以在结束前执行更多的任务。
 */

// 任务循环
function workLoop(deadline) {
  // 执行子任务 --> 返回下个子任务  --> ...循环上述步骤 --> 没有子任务  -->  提交

  //有下一个任务，并且当前帧还没有结束
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 没有子任务
  if (!nextUnitOfWork && wipRoot) {
    // 提交
    commitRoot();
  }
}

// 执行单位工作;
function performUnitOfWork(fiber) {
  const { type } = fiber;

  if (typeof type === "function") {
    type.isReactComponent
      ? // node = type.prototype.isReactComponent
        updateClassComponent(fiber)
      : updateFunctionComponent(fiber);
  } else if (type) {
    // 1.执行当前的任务
    updateHostcomponent(fiber);
  } else {
    updateFragmentComponent(fiber);
  }

  // 2.返回再下一个任务:  先寻找：子元素
  if (fiber.child) {
    return fiber.child;
  }
  // 如果没有子元素，寻找兄弟元素
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 原生组件 构建 fiber 树 div/p/h1/
function updateHostcomponent(fiber) {
  // 每一个 fiber 上挂一个 node
  if (!fiber.node) {
    // 如果没有增加载 node
    // 创建 node节点
    fiber.node = createNode(fiber);
  }

  const { children } = fiber.props; // 获取fiber.props下的 children
  reconcilerChildren(fiber, children); // 创建 children 节点
  console.log("fiber", fiber);
}
// 更新 function组件，构建 fiber
function updateFunctionComponent(fiber) {
  // wipFiber = fiber;
  // hookIndex = 0;
  // wipFiber.hooks = [];
  const { type, props } = fiber;
  const children = [type(props)];
  console.log("updateFunctionComponent", children);
  reconcilerChildren(fiber, children);
}
// 更新 ClassComponent 组件，构建 fiber
function updateClassComponent(fiber) {
  // wipFiber = fiber;
  // hookIndex = 0;
  // wipFiber.hooks = [];
  const { type, props } = fiber;
  console.log("-------type", type);
  console.log("-------props", props);
  const cmp = new type(props);
  const children = [cmp.render()];
  console.log("-------children", children);

  console.log("updateFunctionComponent", children);
  reconcilerChildren(fiber, children);
}

function updateFragmentComponent(fiber) {
  const { children } = fiber.props;
  reconcilerChildren(fiber, children);
}

function createNode(vnode) {
  // console.log(vnode);
  const { type, props } = vnode;
  let node;
  let propName;

  if (type === "TEXT") {
    node = document.createTextNode("");
  } else if (type) {
    // 当 type 是 div、h1、p。。。H5标签时
    node = document.createElement(type);
  }

  updateNode(node, props);
  // reconcilerChildren(props.children, node);
  return node;
}

// function reconcilerChildren(children, node) {
//   for (let i = 0; i < children.length; i++) {
//     // console.log("children", children[i]); //sy-log
//     let child = children[i];
//     // 遍历 创建元素
//     // 判读children[i]类型
//     if (Array.isArray(child)) {
//       for (let j = 0; j < child.length; j++) {
//         render(child[j], node);
//       }
//     } else {
//       render(children[i], node);
//     }
//   }
// }

// 更新节点上属性，如className、nodeValue等
function updateNode(node, props) {
  // console.log(node);
  // console.log(props);
  for (let [key, value] of Object.entries(props)) {
    // console.log(key);
    // console.log(value);
    if (key !== "children") {
      if (key.slice(0, 2) === "on") {
        // 判断属性是不是带on，是一个事件函数
        let eventName = key.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, value); // addEventLister监听click事件， 的 value 函数， 挂载 到  node 节点
      } else {
        node[key] = value;
      }
    }
  }
}

// 构建fiber 结构， 遍历  workInProgressFiber 的子节点
// 这里的构建是按照顺序的，没有考虑移动位置等等
// 更新 删除 新增
function reconcilerChildren(workInProgressFiber, children) {
  // reconciler 调解人
  // 工作中的fiber 和 children
  let prevSibling = null;
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
  // 数组
  //  更新 删除  新增
  for (let i = 0, len = children.length; i < len; i++) {
    let child = children[i];
    let newFiber = null;
    newFiber = {
      type: child.type, //类型 区分不同的fiber,比如说function class host等
      props: child.props, //属性参数等
      node: null, // 真 实dom节点
      base: null, // 存储fiber, 便于去diff比较
      parent: workInProgressFiber,
      effectTag: PLACEMENT,
    };
    // todo 删除
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    // 形成链表结构
    if (i === 0) {
      // 构建 workInProgressFiber
      workInProgressFiber.child = newFiber;
    } else {
      // i>0
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }
}
// 提交
function commitRoot() {
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 提交 具体的fiber
function commitWorker(fiber) {
  if (!fiber) {
    return;
  }
  // 向上查找
  let parentNodeFiber = fiber.parent;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.parent;
  }
  const parentNode = parentNodeFiber.node;
  // 更新 删除 新增
  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    parentNode.appendChild(fiber.node);
  }
  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

// <------------------------------------------------------->  Hooks

// export function useState(init) {
//   const state = init;
//   const setState = action => {
//     console.log(action, ApplicationCache)
//   }
// }
export default {
  render,
};

// !节点类型
// 文本节点
// html标签节点
// class componet
// function component
// fragment

// jsx=>createElement(生成element，就是我们需要的虚拟dom)=>render(vnode->node, 再把node渲染到container)
// vnode->node的流程注意下节点的区分，不同节点处理方式不同
