import axios, { type CreateAxiosDefaults } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { config } from "../config";

const jar = new CookieJar();

type AxiosConfigWithJar = CreateAxiosDefaults & { jar: CookieJar };

const axiosConfig: AxiosConfigWithJar = {
  baseURL: config.baseUrl,
  jar,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  },
};

export const http = wrapper(axios.create(axiosConfig) as any);
