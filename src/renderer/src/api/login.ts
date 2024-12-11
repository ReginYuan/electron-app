import request from '@utils/request'

export const login = (data: unknown) => {
  return request({
    url: 'i/loginByJson',
    method: 'post',
    data
  })
}
