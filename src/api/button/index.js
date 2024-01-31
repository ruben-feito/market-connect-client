import { apiRequest } from '../../utils/api-request';

class ButtonApi {
  async getButtons(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/button', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getButton(id) {
    const response = await apiRequest(`admin/button/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createButton(payload) {
    const response = await apiRequest(`admin/button`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateButton(id, payload) {
    const response = await apiRequest(`admin/button/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteButton(id) {
    const response = await apiRequest(`admin/button/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const buttonApi = new ButtonApi();
