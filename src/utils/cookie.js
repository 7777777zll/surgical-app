import Cookies from 'js-cookie'

const LoginStatus = 'status'

export function getStatus () {
  return Cookies.get(LoginStatus)
}

export function setStatus (status) {
  return Cookies.set(LoginStatus, status)
}

export function removeStatus () {
  return Cookies.remove(LoginStatus)
}
