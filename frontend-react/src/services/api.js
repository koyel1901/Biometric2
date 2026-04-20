// src/config/api.js

const BASE_URL = "https://api.attendance.gridsphere.in";


// generic API request function

const apiRequest = async (endpoint, options = {}) => {

  const token = localStorage.getItem("token");

  const config = {

    method: options.method || "GET",

    headers: {

      "Content-Type": "application/json",

      ...(token && { Authorization: `Bearer ${token}` }),

      ...options.headers

    },

    ...options

  };



  try {

    const response = await fetch(

      `${BASE_URL}${endpoint}`,

      config

    );



    if (!response.ok) {

      const errorText = await response.text();

      throw new Error(errorText || "API error");

    }



    return await response.json();

  }

  catch (error) {

    console.error("API ERROR:", error);

    throw error;

  }

};



// helper methods

export const api = {

  get: (endpoint) =>

    apiRequest(endpoint),



  post: (endpoint, body) =>

    apiRequest(endpoint, {

      method: "POST",

      body: JSON.stringify(body)

    }),



  put: (endpoint, body) =>

    apiRequest(endpoint, {

      method: "PUT",

      body: JSON.stringify(body)

    }),



  patch: (endpoint, body) =>

    apiRequest(endpoint, {

      method: "PATCH",

      body: JSON.stringify(body)

    }),



  delete: (endpoint) =>

    apiRequest(endpoint, {

      method: "DELETE"

    })

};



export default BASE_URL;