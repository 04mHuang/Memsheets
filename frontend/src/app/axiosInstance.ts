import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS
})

// Intercepts requests sent from client to add authorization header
// Can only be used after token is generated and stored in localStorage i.e. after successful login
// Needed to check which user is accessing the site
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;