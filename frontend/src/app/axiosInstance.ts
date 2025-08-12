import axios from "axios";

const getCookie = (name: string) => {
  const allCookies = `; ${document.cookie}`;
  // Isolate the leading cookies from the cookies starting with the specified cookie
  const parts = allCookies.split(`; ${name}=`);
  if (parts.length === 2) {
    // Extract the specified cookie from the trailing cookies
    return parts.pop()?.split(";").shift();
  }
  return "";
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
  withCredentials: true,
})

// Intercepts requests sent from client to add CSRF token to header
// Can only be used after a successful login
instance.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrf_access_token");
  if (csrfToken) {
    config.headers["X-CSRF-TOKEN"] = csrfToken;
  }
  return config;
});

// Backend to frontend
// Catch 401 errors for due to timed out access tokens
instance.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    // Return the error
    return Promise.reject(error);
  }
);

export default instance;