import { apiRequest } from '../../utils/api-request';
import { applyPagination } from '../../utils/apply-pagination';
import { applySort } from '../../utils/apply-sort';
import { deepCopy } from '../../utils/deep-copy';
import { customer, customers, emails, invoices, logs } from './data';

class CustomersApi {
  async getCustomers(request = {}) {
    const { filters, page, perPage, sortBy, sortDir } = request;

    const result = await apiRequest('admin/customers', {
      method: 'GET',
      params: {
        id: filters?.id,
        ids: filters?.ids,
        search: filters?.search,
        name: filters?.name,
        email: filters?.email,
        groupId: filters?.groupId,
        storeId: filters?.storeId,
        phone: filters?.phone,
        isGuest: 0,
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDir,
      },
    });

    return result;
  }

  async getCustomerById(id) {
    const result = await apiRequest(`admin/customers/${id}`);

    return result;
  }

  async updateCustomerById(id, data) {
    const result = await apiRequest(`admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return result;
  }

  async sendPasswordResetEmail(email) {
    return apiRequest('shop/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  getCustomer(request) {
    return Promise.resolve(deepCopy(customer));
  }

  getEmails(request) {
    return Promise.resolve(deepCopy(emails));
  }

  getInvoices(request) {
    return Promise.resolve(deepCopy(invoices));
  }

  getLogs(request) {
    return Promise.resolve(deepCopy(logs));
  }
}

export const customersApi = new CustomersApi();
