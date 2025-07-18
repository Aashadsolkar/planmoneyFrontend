
import axios from 'axios';
import { SERVICE_API_ENDPOINTS } from './apis/apiEndPoints';
// import Constants from "expo-constants";

// const { API_URL } = Constants.expoConfig.extra;
const API_URL ='https://admin.planmoney.in'

export const login = async (data = null) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/login`,
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
      url: `${API_URL}/api/customer/register`,
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
      url: `${API_URL}/api/services`,
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
      url: `${API_URL}/api/customer/customer-details`,
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
      url: `${API_URL}/api/customer/apply-coupon`,
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
  try {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/api/customer/services/${id}`,
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
      url: `${API_URL}/api/customer/profile`,
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
      url: `${API_URL}/api/country`,
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

export const stateApi = async (stateId) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/api/state/${stateId}`,
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

export const cityApi = async (id) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/api/cities/${id}`,
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


export const quetionerApi = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/questionnaire`,
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
      url: `${API_URL}/api/cashfree/create-order`,
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
      url: `${API_URL}/api/cashfree/verify/${orderId}`,
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
      url: `${API_URL}/api/customer/subscribe`,
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
      url: `${API_URL}/api/customer/lead`,
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
      url: `${API_URL}/api/customer/apply-referral`,
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
      url: `${API_URL}/api/pms-data`,
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
      url: `${API_URL}/api/forgot-password/request-otp`,
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

export const resetPasswordPreLogin = async (data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/forgot-password/reset`,
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

export const verifyOtp = async (data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/forgot-password/verify-otp`,
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


export const changePassword = async (data, token) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/update-password`,
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
      url: `${API_URL}/api/customer/email/send-otp`,
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
      url: `${API_URL}/api/customer/email/verify-otp`,
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
      url: `${API_URL}/api/latest-news`,
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
      url: `${API_URL}/api/latest-news/${id}`,
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
      url: `${API_URL}/api/pms-data`,
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
      url: `${API_URL}/api/quantumvault-data`,
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
      url: `${API_URL}/api/quantumvault-data`,
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
      url: `${API_URL}/api/stock-daily-price`,
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
      url: `${API_URL}/api/pis-data`,
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
      url: `${API_URL}/api/pis-data`,
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

export const RegisterPushNotificationToken = async (deviceToken, token) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/save-device-token`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // space is important here
      },
      data: {
        device_token: deviceToken, // pass as JSON body
      },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error?.response?.data || error.message);
    throw error?.response?.data || { message: 'Something went wrong' };
  }
};

export const newArrivals = async (token) => {
  try {
    const response = await axios.get(
      SERVICE_API_ENDPOINTS.NEW_ARRIVALS,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${token}`,
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid Token");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const optionstocks = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/optionstocks`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${token}`,
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid Token");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const verifyQuestioner = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/verify-questionnarie`,
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


export const sendRequestApi = async (token) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/digilocker/send`,
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

export const verifyKYCApi = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/digilocker/verify`,
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

export const updateCapital = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/update-questionnaire-capitalAmount`,
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

export const createMobileOTP = async (token) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/sms/send-otp`,
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


export const verifyMobileOTP = async (token, data) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/customer/sms/verify-otp`,
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

export const getFastlaneHistoryData = async (token, id) => {
  // url ${API_URL}/api/customer/services/1
  try {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/api/customer/services-recommeded-history/${id}`,
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

export const getAdvertisementData = async (token) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_URL}/api/get-advertisement`,
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