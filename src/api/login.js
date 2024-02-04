import request from '@/utils/request';

// 创建企业账户
export function createCorpAppUrl(params = {}) {
  return request({
    url: '/mobile/createCropAccount',
    method: 'post',
    data: params,
    headers: { isToken: false },
  });
}

// 验证码
export function smsCodeUrl(params = {}) {
  return request({
    url: '/mobile/sendSms',
    method: 'post',
    data: params,
    headers: { isToken: false },
  });
}
// 兑换h5
export function redeemRedeemCodeUrlH5(params = {}) {
  return request({
    url: '/mobile/redeemH5',
    method: 'post',
    data: params,
    headers: { isToken: false },
  });
}
