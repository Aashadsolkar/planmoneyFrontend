import axios from "axios";
import { CUSTOMER_API_ENDPOINTS } from "./apiEndPoints";

export const customerLogin = async (data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.CUSTOMER_LOGIN,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid login credentials");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const registerNewCustomer = async (data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.REGISTER_NEW_CUSTOMER,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid login credentials");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const getCustomerServices = async () => {
  try {
    const response = await axios.get(CUSTOMER_API_ENDPOINTS.CUSTOMER_SERVICES, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid login credentials");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const applyCouponCode = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.APPLY_COUPON_CODE,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${token}`,
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid login credentials");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const getFastLaneServiceData = async (token, id) => {
  try {
    const response = await axios.get(
      CUSTOMER_API_ENDPOINTS.GET_FASTLANE_SERVICE(id),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${token}`,
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid  credentials");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const getCustomerProfileDetails = async (token) => {
  try {
    const response = await axios.get(
      CUSTOMER_API_ENDPOINTS.CUSTOMER_PROFILE_DETAILS,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer${token}`,
        },
      }
    );
    if (response.data?.status === false) {
      throw new Error(response.data?.message || "Invalid  credentials");
    }
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

export const customerQuestionary = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.CUSTOMER_QUESTIONARY,
      data,
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

export const buyServiceSubscription = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.BUY_SERVICE_SUBSCRIPTION,
      data,
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

export const customerLeads = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.CUSTOMER_LEADS,
      data,
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

export const applyReferral = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.APPLY_REFERRAL_CODE,
      data,
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

export const changeCustomerPassword = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.UPDATE_CUSTOMER_PASSWORD,
      data,
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

export const generateOTPWithEmail = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.GENERATE_OTP_WITH_EMAIL,
      data,
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

export const verifyEmailOpt = async (token, data) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.VERIFY_WITH_EMAIL_OTP,
      data,
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

export const registerNotificationToken = async (token, deviceToken) => {
  try {
    const response = await axios.post(
      CUSTOMER_API_ENDPOINTS.REGISTER_PUSH_NOTIFICATION_SERVICE,
      {
        data: {
          device_token: deviceToken,
        },
      },
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
