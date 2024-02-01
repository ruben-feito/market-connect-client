import { createResourceId } from '../../utils/create-resource-id';
import { decode, JWT_EXPIRES_IN, JWT_SECRET, sign } from '../../utils/jwt';
import { apiRequest } from '../../utils/api-request';
import { users } from './data';
import Cookies from 'js-cookie';

class AuthApi {
  async signIn(request) {
    const { email, password, remember } = request;

    const response = await apiRequest('auth/login', {
      method: 'POST',
      useToken: false,
      body: JSON.stringify({
        email,
        password,
        remember,
      }),
    });

    return { accessToken: response.token };
  }

  async signUp(request) {
    const { email, name, password } = request;

    return apiRequest('auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });
  }

  async signOut() {
    return apiRequest('auth/logout', {
      method: 'POST',
    });
  }

  async me() {
    return apiRequest('me');
  }

  async forgotPassword(request) {
    const { email } = request;
    return apiRequest('auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    });
  }

  async resetPassword(request) {
    const { token, email, password, confirm_password } = request;

    return apiRequest('auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        email,
        password,
        confirm_password,
      }),
    });
  }
}

export const authApi = new AuthApi();
