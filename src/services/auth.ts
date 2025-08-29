import { http } from "@/lib/baseRequest";
import { LoginData } from "@/types/response/auths/login";

export async function signIn(data: any): Promise<LoginData> {
  return http.axios.request({
    method: 'POST',
    url: `/auth/sign-in`,
    data,
  })
}

export async function refreshAccessToken(): Promise<any> {
  return http.axios.request({
    method: 'POST',
    url: `/auth/refresh-token`,
  })
}