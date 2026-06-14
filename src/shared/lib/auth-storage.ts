const EMAIL_KEY = "userEmail";
const TOKEN_KEY = "token";

/** 로그인 시 /user/get으로 받은 이메일을 저장한다. */
export function setStoredEmail(email: string) {
  localStorage.setItem(EMAIL_KEY, email);
}

/** 마이페이지 등에서 로그인한 계정 이메일을 읽는다. */
export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

/** 로그아웃 시 인증 관련 로컬 저장값을 모두 비운다. */
export function clearAuthStorage() {
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
