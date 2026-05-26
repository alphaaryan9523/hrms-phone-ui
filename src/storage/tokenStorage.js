import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'hrms_employee_token';
const REFRESH_TOKEN_KEY = 'hrms_employee_refresh_token';
const USER_KEY = 'hrms_employee_user';
const ROLE_KEY = 'hrms_employee_role';

export async function getToken() {
  const { value } = await Preferences.get({ key: TOKEN_KEY });
  return value;
}

export async function setToken(token) {
  await Preferences.set({ key: TOKEN_KEY, value: token });
}

export async function getRefreshToken() {
  const { value } = await Preferences.get({ key: REFRESH_TOKEN_KEY });
  return value;
}

export async function setRefreshToken(refreshToken) {
  if (!refreshToken) return;
  await Preferences.set({ key: REFRESH_TOKEN_KEY, value: refreshToken });
}

export async function clearToken() {
  await Promise.all([
    Preferences.remove({ key: TOKEN_KEY }),
    Preferences.remove({ key: REFRESH_TOKEN_KEY })
  ]);
}

export async function getStoredRole() {
  const { value } = await Preferences.get({ key: ROLE_KEY });
  return value;
}

export async function setStoredRole(role) {
  if (!role) return;
  await Preferences.set({ key: ROLE_KEY, value: role });
}

export async function clearStoredRole() {
  await Preferences.remove({ key: ROLE_KEY });
}

export async function getStoredUser() {
  const { value } = await Preferences.get({ key: USER_KEY });
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function setStoredUser(user) {
  await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
}

export async function clearStoredUser() {
  await Preferences.remove({ key: USER_KEY });
}

export async function clearSessionStorage() {
  await Promise.all([clearToken(), clearStoredUser(), clearStoredRole()]);
}
