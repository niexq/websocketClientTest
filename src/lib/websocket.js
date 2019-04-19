
import io from 'socket.io-client';
import _ from 'lodash';
import { getCurrentUser } from './utils';

const env = process.env.NODE_ENV || 'development';
const config = require(`./config.${env}`);

export const CHATWEBSOCKET = 'CHATWEBSOCKET'
export const NEWSWEBSOCKET = 'NEWSWEBSOCKET'


const chatWebSocket = io(config.chatWebSocket,{
  autoConnect: false
});


const newsWebSocket = io(config.newsWebSocket,{
  autoConnect: false
});

export function chatSocketBind(cb){
  console.error('~~~~~chatWebSocket', chatWebSocket);
  if(!chatWebSocket.connected) chatWebSocket.open();

  // 把当前用户名称发给服务器缓存下来，然后服务器给指定用户发信息(按业务需要，可以把当前用户信息包括token信息发给服务器缓存下来，然后服务器给指定用户发信息)
  const { id, token } = getCurrentUser();
  if(!id || !token) return;
  chatWebSocket.emit('chatSocketBind', id, token);

  // 绑定chat服务器发来的notify消息
  if(_.isFunction(cb)) chatWebSocket.on('notify', (...args) => cb(...args));

  // chatWebSocket.emit('firstMessageType', '嗨，我要建立websocket协议，需要chat服务')
}

export function newsSocketBind(cb){
  if(!newsWebSocket.connected) newsWebSocket.open();

  // 把当前用户名称发给服务器缓存下来，然后服务器给指定用户发信息
  const { id, token } = getCurrentUser();
  if(!id || !token) return;
  newsWebSocket.emit('newsSocketBind', id, token);

  // 绑定news服务器发来的notify消息
  if(_.isFunction(cb)) newsWebSocket.on('notify', (...args) => cb(...args));
}

export function sendMessage({ serviceType, messageType, message }) {
  const { id, name, token } = getCurrentUser();
  if(!id || !token) return;

  switch(serviceType) {
    case CHATWEBSOCKET:
      chatWebSocket.emit(messageType, id, name, message);
      break;
    case NEWSWEBSOCKET:
      newsWebSocket.emit(messageType, id, name, message);
      break;
    default:
      break;
  }
}

