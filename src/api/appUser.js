import request from '@/utils/request';

/**
 *
 * @param {*} 查询企业信息
 * @returns
 */
export function appUserGetCompanyInfo(params = {}) {
  return request({
    url: '/appUser/getCompanyInfo',
    method: 'get',
    params
  });
}

/**
 *
 * @param {*} 应用用户注册
 * @returns
 */
export function appUserRegister(data = {}) {
  return request({
    url: '/appUser/register',
    method: 'post',
    data
  });
}

/**
 *
 * @param {*} 发送短信验证码
 * @returns
 */
export function appUserSendSms(data = {}) {
  return request({
    url: '/appUser/sendSms',
    method: 'post',
    data
  });
}
