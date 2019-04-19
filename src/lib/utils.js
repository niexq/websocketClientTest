
export function setCurrentUser(userInfo) {
  sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
}

export function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem('USER_INFO')) || {};
}