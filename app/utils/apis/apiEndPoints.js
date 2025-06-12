const BASE_URL = "https://admin.planmoney.in/api";

export const CUSTOMER_API_ENDPOINTS = {
  CUSTOMER_LOGIN: `${BASE_URL}/customer/login`,
  REGISTER_NEW_CUSTOMER: `${BASE_URL}/customer/register`,
  CUSTOMER_SERVICES: `${BASE_URL}/customer/customer-details`,
  APPLY_COUPON_CODE: `${BASE_URL}/customer/apply-coupon`,
  GET_FASTLANE_SERVICE: (id) => `${BASE_URL}/customer/services/${id}`,
  CUSTOMER_PROFILE_DETAILS: `${BASE_URL}/customer/profile`,
  CUSTOMER_QUESTIONARY: `${BASE_URL}/customer/questionnaire`,
  BUY_SERVICE_SUBSCRIPTION: `${BASE_URL}/customer/subscribe`,
  CUSTOMER_LEADS: `${BASE_URL}/customer/lead`,
  APPLY_REFERRAL_CODE: `${BASE_URL}/customer/apply-referral`,
  UPDATE_CUSTOMER_PASSWORD: `${BASE_URL}/customer/update-password`,
  GENERATE_OTP_WITH_EMAIL: `${BASE_URL}/customer/email/send-otp`,
  VERIFY_WITH_EMAIL_OTP: `${BASE_URL}/customer/email/verify-otp`,
  REGISTER_PUSH_NOTIFICATION_SERVICE: `${BASE_URL}/customer/save-device-token`,
};

export const SERVICE_API_ENDPOINTS = {
  PRODUCT_SERVICES: `${BASE_URL}/services`,
  BUY_PMS_SERVICE: `${BASE_URL}/pms-data`,
  PRODUCT_NEWS: `${BASE_URL}/latest-news`,
  GET_SINGLE_NEWS: (id) => `${BASE_URL}/latest-news/${id}`,
  PMS_PORTFOLIO_DATA: `${BASE_URL}/pms-data`,
  BUY_QUANTUM_SERVICE: `${BASE_URL}/quantumvault-data`,
  QUANTUM_PORTFOLIO_DATA: `${BASE_URL}/quantumvault-data`,
  GET_CMP_STOCK_DETAILS: `${BASE_URL}/stock-daily-price`,
};

export const LOCATION_API_ENDPOINTS = {
  GET_COUNTRY_DETAILS: `${BASE_URL}/country`,
  GET_STATE_DETAILS: (id) => `${BASE_URL}/state/${id}`,
  GET_CITY_DETAILS: (id) => `${BASE_URL}/state/${id}`,
};

export const CASH_FREE_GATEWAY = {
  CREATE_ORDER: `${BASE_URL}/cashfree/create-order`,
  VERIFY_ORDER: (id) => `${BASE_URL}/cashfree/verify/${id}`,
};

export const COMMON_API_ENDPOINTS = {
  REQ_OTP: `${BASE_URL}/forgot-password/request-otp`,
  RESET_PASSWORD: `${BASE_URL}/forgot-password/reset`,
  VERIFY_OTP: `${BASE_URL}/forgot-password/verify-otp`,
};
