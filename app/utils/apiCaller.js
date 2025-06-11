// utils/apiCaller.js
import axios from 'axios';

export const login = async (data = null) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/login",
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const registor = async (data = null) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/register",
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};


export const service = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/services",
      // data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const customerService = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/customer/customer-details",
      // data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const applyCouponApi = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/apply-coupon",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const getFastlaneData = async (token, id) => {
  // url https://admin.planmoney.in/api/customer/services/1
  try {
    const response = await axios({
      method: "GET",
      url: `https://admin.planmoney.in/api/customer/services/${id}`,
      // data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};


export const getProfileData = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/customer/profile",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const countryApi = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/country",
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const stateApi = async (stateId) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://admin.planmoney.in/api/state/${stateId}`,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization' : `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const cityApi = async (id) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://admin.planmoney.in/api/cities/${id}`,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};


export const quetionerApi = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/questionnaire",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const pgCreateOrder = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/cashfree/create-order",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};


export const pgVerifyOrder = async (token, orderId) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://admin.planmoney.in/api/cashfree/verify/${orderId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const buySubscription = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `https://admin.planmoney.in/api/customer/subscribe`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};


export const leads = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `https://admin.planmoney.in/api/customer/lead`,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const applyReferralApi = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/apply-referral",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const BuyPmsStock = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/pms-data",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};




export const requestOtp = async (data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/forgot-password/request-otp",
      data,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const resetPasswordPreLogin = async (data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/forgot-password/reset",
      data,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/forgot-password/verify-otp",
      data,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};


export const changePassword = async (data, token) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/update-password",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const generateVerifyEmailOpt = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/email/send-otp",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const verifyEmailOpt = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/customer/email/verify-otp",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const news = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://admin.planmoney.in/api/latest-news`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const singleNews = async (token, id) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://admin.planmoney.in/api/latest-news/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const pmsPortfolio = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/pms-data",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const quantomPortfolio = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/quantumvault-data",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const BuyQuantomStock = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/quantumvault-data",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};
export const getCmpStock = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/stock-daily-price",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const pisPortfolio = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://admin.planmoney.in/api/pis-data",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const BuyPISStock = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://admin.planmoney.in/api/pis-data",
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};