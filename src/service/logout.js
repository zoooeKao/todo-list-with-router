// void 相當於 undefined，差別在於不在乎回傳什麼東西
// * @returns {Promise<void>}
/**
 * @returns {Promise<void>}
 */
export function logout() {
  return fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => {
    return res.ok ? undefined : Promise.reject('logout fail');
  });
}
