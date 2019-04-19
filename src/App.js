import React, { Component } from 'react';

import WebSocket from './components/WebSocket';

import { setCurrentUser } from './lib/utils';

// import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.userInfo = [{
      id: 8000000,
      name: '张三',
      age: '18',
      token: '3456db5ea3a07afbafc59bc3fc2fbbcd',
    }, {
      id: 9000000,
      name: '李四',
      age: '18',
      token: '4567db5ea3a07afbafc59bc3fc2fbbcd',
    }];
    this.state = {
      isForceUpdate: false
    }
  }

  onClick = (userInfo) => () => {
    setCurrentUser(userInfo);
    this.setState(preState => ({
      isForceUpdate: !preState.isForceUpdate,
    }))
  }
  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        <div style={{ padding: '20px', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', display: 'flex', flexFlow: 'column nowrap' }}>
          <span>用户身份设置：</span>
          <div style={{ padding: '15px' }}>
            <button
              name='我是张三，把我信息缓存到sessionStorage中'
              onClick={
                this.onClick(this.userInfo[0])
              }
              style={{ borderRadius: '5px', color: 'blue', height: '30px', lineHeight: '30px' }}
            >我是张三，把我信息缓存到sessionStorage中</button>
            <button
              name='我是李四，把我信息缓存到sessionStorage中'
              onClick={
                this.onClick(this.userInfo[1])
              }
              style={{ borderRadius: '5px', color: 'blue', height: '30px', lineHeight: '30px', marginLeft: '10px' }}
            >我是李四，把我信息缓存到sessionStorage中</button>
          </div>
        </div>
        <WebSocket isForceUpdate={this.state.isForceUpdate} />
      </div>
    );
  }
}

export default App;
