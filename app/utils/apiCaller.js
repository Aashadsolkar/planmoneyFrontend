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

export const getFastlaneData = async (token,id) => {
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


export const uzairGnadu = async (token, data) => {
  try {
    const response = await axios({
      method: "GET",
      url: "http://192.168.1.36:8000/api/cities/1",
      // data,
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