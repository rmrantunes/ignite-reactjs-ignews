import axios from "axios";

export const makeAPIRoutesRequest = axios.create({
  baseURL: "/api",
});
