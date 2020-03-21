const axios = require('axios');
const fs = require('fs');
// const request = require('request');
const FormData = require('form-data');

const { Plain, Image } = require('./MessageComponent');

const sendFriendMessage = async ({
  messageChain,
  target,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendFriendMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendFriendMessage:', e.message);
  });
  return data;
};
const sendQuotedFriendMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendFriendMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
  });
  return data;
};

const sendGroupMessage = async ({
  messageChain,
  target,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendGroupMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendGroupMessage:', e.message);
  });
  return data;
};
const sendQuotedGroupMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendGroupMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
  });
  return data;
};

const uploadImage = async ({
  url,
  type,
  sessionKey,
  host,
}) => {
  let img = url;
  if (typeof url === 'string') img = fs.createReadStream(url);
  const form = new FormData();
  form.append('sessionKey', sessionKey);
  form.append('type', type);
  form.append('img', img);
  const { data } = await axios.post(`${host}/uploadImage`, form, {
    headers: form.getHeaders(),
  });
  return data;
};

const sendImageMessage = async ({
  url,
  qq,
  group,
  sessionKey,
  host = 8080,
}) => {
  let type, send, target;
  if (qq) {
    type = 'friend';
    send = sendFriendMessage;
    target = qq;
  } else if (group) {
    type = 'group';
    send = sendGroupMessage;
    target = group;
  } else return console.error('Error @ sendImageMessage: you should provide qq or group');
  const image = await uploadImage({
    url,
    type,
    sessionKey,
    host,
  });
  const messageChain = [Image(image)];
  return send({
    messageChain,
    target,
    sessionKey,
    host,
  });
};

module.exports = {
  sendFriendMessage,
  sendQuotedFriendMessage,
  sendGroupMessage,
  sendQuotedGroupMessage,
  uploadImage,
  sendImageMessage,
};
