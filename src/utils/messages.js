import localize from '@/filters/localize.filter'

export default {
  'logout': localize('logout'),
  'login': localize('login'),
  'auth/user-not-found': localize('auth/user-not-found'),
  'auth/wrong-password': localize('auth/wrong-password'),
  'auth/user-disabled': localize('auth/user-disabled'),
  'auth/email-already-in-use': localize('auth/email-already-in-use'),
  'auth/too-many-requests': localize('auth/too-many-requests')
}
