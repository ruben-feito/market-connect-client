import { apiRequest } from '../../utils/api-request';

class JobDemandsApi {
  async getJobOffer(id) {
    const response = await apiRequest(`admin/job-demands/job-offer/${id}`, {
      useToken: true,
      method: 'GET',
    });

    return response;
  }

  async getDemand(id) {
    const response = await apiRequest(`admin/job-demands/${id}`, {
      useToken: true,
      method: 'GET',
    });

    return response;
  }

  async deleteDemand(id) {
    const response = await apiRequest(`admin/job-demands/${id}`, {
      useToken: true,
      method: 'DELETE',
    });

    return response;
  }
}

export const jobDemandsAPI = new JobDemandsApi();
