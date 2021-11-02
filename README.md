从本人 GitLab 上转过来的，最近在准备简历，上传上来充门面，哈哈哈。

之前在阅读React源码时，给代码做的注释 以及 参照官方源码 手写的了部分

手写的部分代码位于： src/myReact 和 myReact2-fiber文件夹

关于React源码注释的位于：  packages 文件夹

代码断断续续读了很久，reconcile 调和阶段的代码，还是没咋看懂

可以结合这篇文章看：[React 源码解析](https://react.jokcy.me/book/update/expiration-time.html).


## React  render的更新

ReactDOM.render(渲染虚拟dom树)

-->
legacyRenderSubtreeIntoContainer(首次渲染还是非首次)

-->
updateContainer（更新容器）

-->
update = createUpdate（创建更新）

-->
enqueueUpdate(current：当前fiber , update： 更新)：入栈排队更新

-->
scheduleWork(current：当前fiber ,expirationTime：计算到的过期时间)：开始调度

-->

## React  setState 更新

this.setState

-->
Component.prototype.setState

-->
classComponentUpdater

-->
enqueueSetState

-->
update = createUpdate(expirationTime, suspenseConfig);  // 创建更新

-->
// setState接下来 和 render一样： 都走任务调度
enqueueUpdate(fiber, update): 入栈排队更新

-->
scheduleWork(fiber, expirationTime)：开始调度

## React Fiber计算过期时间


computeExpirationForFiber():计算过期时间

-->
computeAsyncExpiration(LOW_PRIORITY_EXPIRATION: 低优先级 )：计算 异步 过期时间
computeInteractiveExpiration(HIGH_PRIORITY_EXPIRATION：高优先级 ):计算 交互 过期时间

-->
computeExpirationBucket()

## React scheduleWork 开始调度

scheduleWork：开始调度

-->
scheduleUpdateOnFiber：在 fiber 上更新时间表

-->
getCurrentPriorityLevel：获取当前优先级

-->

performSyncWorkOnRoot //及时优先级:   执行同步工作
-->
-->




## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

