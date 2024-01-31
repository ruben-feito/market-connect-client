import { apiRequest } from '../../utils/api-request';

class ProcessesApi {
  async getProcesses(request = {}) {
    //TODO: Add paginations & filters option in the future (api side)
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/processes', {
      method: 'GET',
      // params: {
      //   page: Math.max(1, page + 1),
      //   perPage,
      //   status: filters.status,
      // },
    });

    return response;
  }

  async executeProcess(id) {
    return await apiRequest(`admin/processes/${id}/execute`, {
      method: 'POST',
    });
  }
}

export const processesApi = new ProcessesApi();
