// src/helpers/token.js
export function getSessionIdFromToken (token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))?.sessionId;
  } catch {
    return null;
  }
}
