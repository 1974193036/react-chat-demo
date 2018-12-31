// 根据用户信息 返回跳转地址
// 是否跳转到完善信息页
// 是否跳转到boss页还是genius页
export function getRedirectPath({type, avatar}) {
  // user.type /boss /genius
  // user.avater /bossinfo /geniusinfo
  let url = (type === 'boss') ? '/boss' : '/genius'
  if (!avatar) {
    url += 'info'
  }
  return url
}


//  获取chatid
export function getChatId(userId, targetId) {
  return [userId, targetId].sort().join('-')
}