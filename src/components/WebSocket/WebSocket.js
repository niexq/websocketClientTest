import React, { Component } from 'react';
import { CHATWEBSOCKET, chatSocketBind, newsSocketBind, sendMessage } from '../../lib/websocket';

import { getCurrentUser } from '../../lib/utils';
import { findIndex } from 'lodash';

export default class WebSocket extends Component {
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
      threeCommunication: [],           // 张三和服务器的通信内容
      fourCommunication: [],            // 李四和服务器的通信内容
      threeChatInputValue: '',              // 张三询问chat服务器的话
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isForceUpdate !== this.props.isForceUpdate) {
      this.forceUpdate();
    }
  }
  threeChatNotify = (type, userId, message) => {
    if (type === 'broadcastMessage') {
      // 处理chatMessag服务器广播消息
      const threeCommunication = this.state.threeCommunication;
      threeCommunication.push({
        type: 'chatService',
        whoId: 'chatSockService',
        whoName: 'chat服务器',
        toWhoname: '【这是一条广播消息】',
        message,
      })
      this.setState({
        threeCommunication,
      })
    } else if (userId === this.userInfo[0].id) {
      const toWhoname = this.userInfo[0].name || '';
      const threeCommunication = this.state.threeCommunication;
      threeCommunication.push({
        type: 'chatService',
        whoId: 'chatSockService',
        whoName: 'chat服务器',
        toWhoname,
        message: `${toWhoname}, ${message}`
      })
      this.setState({
        threeCommunication
      })
    }
  }
  fourChatNotify = (type, userId, message) => {
    if (type === 'broadcastMessage') {
      // 处理chatMessag服务器广播消息
      const fourCommunication = this.state.fourCommunication;
      fourCommunication.push({
        type: 'chatService',
        whoId: 'chatSockService',
        whoName: 'chat服务器',
        toWhoname: '【这是一条广播消息】',
        message,
      })
      this.setState({
        fourCommunication,
      })
    } else if (userId === this.userInfo[1].id) {
      const toWhoname = this.userInfo[0].name || '';
      const fourCommunication = this.state.fourCommunication;
      fourCommunication.push({
        type: 'chatService',
        whoId: 'chatSockService',
        whoName: 'chat服务器',
        toWhoname,
        message: `${toWhoname}, ${message}`
      })
      this.setState({
        fourCommunication
      })
    }
  }
  newsNotify = (type, userId, message) => {
    if (type === 'broadcastMessage') {
      // 处理chatMessag服务器广播消息
      const threeCommunication = this.state.threeCommunication;
      const fourCommunication = this.state.fourCommunication;
      threeCommunication.push({
        type: 'newsService',
        whoId: 'newsSockService',
        whoName: 'news服务器',
        toWhoname: '【这是一条广播消息】',
        message,
      })
      fourCommunication.push({
        type: 'newsService',
        whoId: 'newsSockService',
        whoName: 'news服务器',
        toWhoname: '【这是一条广播消息】',
        message,
      })
      this.setState({
        threeCommunication,
        fourCommunication,
      })
    } else {
      const index = findIndex(this.userInfo, user => user.id === userId);
      if (index !== -1) {
        const toWhoname = this.userInfo[index].name || '';
        const stateKey = (index === 0 )? 'threeCommunication' : 'fourCommunication';
        const communication = this.state[stateKey];
        communication.push({
          type: 'newsService',
          whoId: 'newsSockService',
          whoName: 'news服务器',
          toWhoname,
          message: `${toWhoname}, ${message}`
        })
        this.setState({
          [stateKey]: communication
        })
      }
    }
  }
  onClickSendMessage = ({ serviceType, messageType, message }) => {
    sendMessage({
      serviceType,
      messageType,
      message
    })
  }
  onStartChatSocketBindClick = (userInfo, message) => () => {
    const notifyFn = userInfo.id === this.userInfo[0].id ? this.threeChatNotify : this.fourChatNotify;
    chatSocketBind((...args) => notifyFn(...args));
    const stateKey = userInfo.id === this.userInfo[0].id ? 'threeCommunication' : 'fourCommunication';
    const communication = this.state[stateKey];
    communication.push({
      type: 'client',
      whoId: userInfo.id,
      whoName: userInfo.name,
      toWhoName: 'chat服务器',
      message
    })
    this.setState({
      [stateKey]: communication
    })
  }
  threeCommunicationPush = (obj) => {
    const threeCommunication = this.state.threeCommunication;
    threeCommunication.push(obj)
    this.setState({
      threeCommunication
    })
  }
  onStartNewsSocketBindClick = (userInfo, message) => () => {
    newsSocketBind((...args) => this.newsNotify(...args));
    const stateKey = userInfo.id === this.userInfo[0].id ? 'threeCommunication' : 'fourCommunication';
    const communication = this.state[stateKey];
    communication.push({
      type: 'client',
      whoId: userInfo.id,
      whoName: userInfo.name,
      toWhoName: 'news服务器',
      message
    })
    this.setState({
      [stateKey]: communication
    })
  }
  onThreeInputChange = (event) => {
    this.setState({
      threeChatInputValue: event.target.value
    })
  }
  threeSendMessage = ({ serviceType, messageType, message }) => () => {
    this.threeCommunicationPush({
      type: 'client',
      whoId: this.userInfo[0].id,
      whoName: this.userInfo[0].name,
      toWhoName: 'chatSockService',
      message
    })
    this.onClickSendMessage({
      serviceType: CHATWEBSOCKET,
      messageType: 'inputMessageType',
      message: this.state.threeChatInputValue,
    })
  }
  render() {
    const { id } = getCurrentUser();
    const isDisabledThree = (id !== this.userInfo[0].id);
    const isDisabledFour = (id !== this.userInfo[1].id);
    return(
      <div>
        <div style={{ padding: '20px', borderTop: '1px solid blue', borderBottom: '1px solid blue', marginBottom: '10px'}}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', height: 'auto', display: 'flex', flexFlow: 'column nowrap', borderRight: '1px solid #ddd' }}>
              <button
                disabled={isDisabledThree}
                name='我是张三，我要启动和chat服务器socket连接'
                onClick={this.onStartChatSocketBindClick(this.userInfo[0], '我是张三，我要启动和chat服务器socket连接')}
                style={{ width: '300px', borderRadius: '5px', color: isDisabledThree ? '#ddd' : 'blue', height: '30px', lineHeight: '30px' }}
              >我是张三，我要启动和chat服务器socket连接</button>
              <div style={{ display: 'flex', margin: '8px 0px', alignItems: 'center' }}>
                <input
                  disabled={isDisabledThree || this.state.threeCommunication.length < 2}
                  style={{ borderRadius: '5px', width: '420px', height: '30px' }}
                  placeholder='输入你想询问chat服务器的话，例如：chat服务器，有没有啥好消息分享？'
                  onChange={this.onThreeInputChange}
                />
                <button
                  disabled={(isDisabledThree || !this.state.threeChatInputValue) || this.state.threeCommunication.length < 2}
                  onClick={this.threeSendMessage({
                    serviceType: CHATWEBSOCKET,
                    messageType: 'inputMessageType',
                    message: this.state.threeChatInputValue,
                  })}
                  style={{ marginLeft: '8px', width: '150px', borderRadius: '5px', color: (isDisabledThree || !this.state.threeChatInputValue || this.state.threeCommunication.length < 2) ? '#ddd' : 'blue', height: '30px', lineHeight: '30px' }}
                >一键发送给chat服务器</button>
              </div>
            </div>
            <div style={{ width: '50%', height: 'auto' }}>
              <button
                disabled={isDisabledThree}
                name='我是张三，我要启动和news服务器socket连接'
                onClick={this.onStartNewsSocketBindClick(this.userInfo[0], '我是张三，我要启动和news服务器socket连接')}
                style={{ borderRadius: '5px', color: isDisabledThree ? '#ddd' : 'blue', height: '30px', lineHeight: '30px', marginLeft: '10px' }}
              >我是张三，我要启动和news服务器socket连接</button>
            </div>
          </div>
          <div style={{ padding: '10px', marginTop: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
            <div>以下是张三和服务器之间的通信：</div>
            <div style={{ display: 'flex', flexFlow: 'column nowrap', padding: '10px 0px' }}>
              {
                this.state.threeCommunication.map((item, index) => {
                  return (
                    <div key={`threeCommuication${index}`} style={{ marginTop: '5px' }}>
                      <span>{`${item.whoName || ''}说 : `}</span>
                      <span style={{ color: 'blue' }}>{`${item.message || ''}。`}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid blue', borderBottom: '1px solid blue', marginBottom: '10px'}}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', height: 'auto', display: 'flex', flexFlow: 'column nowrap', borderRight: '1px solid #ddd' }}>
              <button
                disabled={isDisabledFour}
                name='我是李四，我要启动和chat服务器socket连接'
                onClick={this.onStartChatSocketBindClick(this.userInfo[1], '我是李四，我要启动和chat服务器socket连接')}
                style={{ width: '300px', borderRadius: '5px', color: isDisabledFour ? '#ddd' : 'blue', height: '30px', lineHeight: '30px' }}
              >我是李四，我要启动和chat服务器socket连接</button>
            </div>
            <div style={{ width: '50%', height: 'auto' }}>
              <button
                disabled={isDisabledFour}
                name='我是李四，我要启动和news服务器socket连接'
                onClick={this.onStartNewsSocketBindClick(this.userInfo[1], '我是李四，我要启动和news服务器socket连接')}
                style={{ borderRadius: '5px', color: isDisabledFour ? '#ddd' : 'blue', height: '30px', lineHeight: '30px', marginLeft: '10px' }}
              >我是李四，我要启动和news服务器socket连接</button>
            </div>
          </div>
          <div style={{ padding: '10px', marginTop: '10px', border: '1px solid #ddd', textAlign: 'left' }}>
            <div>以下是李四和服务器之间的通信：</div>
            <div style={{ display: 'flex', flexFlow: 'column nowrap', padding: '10px 0px' }}>
              {
                this.state.fourCommunication.map((item, index) => {
                  return (
                    <div key={`fourCommunication${index}`} style={{ marginTop: '5px' }}>
                      <span>{`${item.whoName || ''}说 : `}</span>
                      <span style={{ color: 'blue' }}>{`${item.message || ''}。`}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}