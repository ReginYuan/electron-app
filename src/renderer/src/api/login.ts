import request from '@utils/request'

export const login = (data: unknown) => {
  return request({
    url: '/u/loginByJson',
    method: 'post',
    data
  })
}
