import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch {
    return true;
  }
}
