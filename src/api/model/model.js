import request from '@/utils/request';
// 模型首页列表
export function modelInfoListUrl() {
  return request({
    url: '/mobile/modelInfoList',
    method: 'get',
  });
}
// 检查兑换码
export function checkRedeemCode(params = {}) {
  return request({
    url: '/mobile/checkRedeemCode',
    method: 'get',
    params
  });
}
