import localize from '@/filters/localize.filter'

export default {
  'logout': localize('logout'),
  'login': localize('login'),
  'recover': localize('recover-message'),
  'auth/user-not-found': localize('auth/user-not-found'),
  'auth/wrong-password': localize('auth/wrong-password'),
  'auth/user-disabled': localize('auth/user-disabled'),
  'auth/email-already-in-use': localize('auth/email-already-in-use'),
  'auth/too-many-requests': localize('auth/too-many-requests'),
  "auth/popup-blocked": localize('auth/popup-blocked'),
  "auth/unauthorized-domain": localize('auth/unauthorized-domain'),
  "auth/cancelled-popup-request": localize('auth/cancelled-popup-request'),
  "auth/popup-closed-by-user": localize('auth/popup-closed-by-user'),
  "auth/account-exists-with-different-credential": localize('auth/account-exists-with-different-credential')
}
