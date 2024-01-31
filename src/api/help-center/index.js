import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

class HelpCenterApi {
  async getHelpCenter(lang) {
    const response = await apiRequest(`admin/help-center/lang/${lang}`, {
      method: 'GET',
    });

    return response;
  }

  async createHelpCenter(data) {
    const response = await apiRequest(`admin/help-center`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  }

  async deleteHelpCenter(id) {
    const response = await apiRequest(`admin/help-center/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async createHelpCenterItem(data) {
    const response = await apiRequest(`admin/help-center-items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  }

  async deleteHelpCenterItem(id) {
    const response = await apiRequest(`admin/help-center-items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async uploadIconHelpCenter(id, data) {
    const formData = new FormData();
    formData.append('icon', data.icon);

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/help-center/icon/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  }

  async updateIconHelpCenter(id, data) {
    const formData = new FormData();
    formData.append('icon', data.icon);

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/help-center/update-icon/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  }

  async getHelpCenterId(id) {
    const response = await apiRequest(`admin/help-center/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async updateHelpCenter(id, data) {
    const response = await apiRequest(`admin/help-center/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateHelpCenterItem(id, data) {
    const response = await apiRequest(`admin/help-center-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  }
}

export const helpCenterApi = new HelpCenterApi();
