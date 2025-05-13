export const isAdminEmail = (email = '') => {
  const adminEmailList = (process.env.ADMIN_EMAIL_LIST || '').split(',')

  return adminEmailList.includes(email)
}
