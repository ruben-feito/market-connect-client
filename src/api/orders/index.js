import { order } from './data';
import { deepCopy } from '../../utils/deep-copy';
import { apiRequest } from '../../utils/api-request';

class OrdersApi {
  async getOrders(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/orders', {
      method: 'GET',
      params: {
        search: filters?.search,
        number: filters?.number,
        statusId: filters?.statusId,
        storeId: filters?.storeId,
        erpId: filters?.erpId,
        customerId: filters?.customerId,
        groupId: filters?.groupId,
        paymentMethodId: filters?.paymentMethodId,
        email: filters?.email,
        pickupStoreId: filters?.pickupStoreId,
        createdFrom: filters?.createdFrom,
        createdTo: filters?.createdTo,
        name: filters?.name,
        shipmentType: filters?.shipmentType,
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDir,
      },
    });

    return response;
  }

  async getOrder(id) {
    const response = await apiRequest(`admin/orders/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async updateOrderStatus(orderId, statusId) {
    const response = await apiRequest(`admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status_id: statusId,
      }),
    });

    return response;
  }

  async updateOrderShippingProvider(orderId, shippingProviderId) {
    const response = await apiRequest(
      `admin/orders/${orderId}/shipping-provider`,
      {
        method: 'PUT',
        body: JSON.stringify({
          shipping_provider_id: shippingProviderId,
        }),
      },
    );

    return response;
  }

  async getOrderInvoice(orderId) {
    const response = await apiRequest(`admin/orders/${orderId}/invoice`, {
      method: 'GET',
    });

    return response;
  }

  async syncOrder(orderId) {
    const response = await apiRequest(`admin/orders/${orderId}/synchronize`, {
      method: 'POST',
    });

    return response;
  }

  async getTaxFreeRequests(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/orders/tax-free-requests', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDir,
      },
    });

    return response;
  }

  async sendConfirmationEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/confirmation`,
      { method: 'POST' },
    );

    return response;
  }

  async sendShippedEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/shipped`,
      { method: 'POST' },
    );

    return response;
  }

  async sendPickupShippedEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/pickup-shipped`,
      { method: 'POST' },
    );

    return response;
  }

  async sendPickupDeliveredEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/pickup-delivered`,
      { method: 'POST' },
    );

    return response;
  }

  async updateBillingAddress(orderId, request = {}) {
    const response = await apiRequest(
      `admin/orders/${orderId}/billing-address`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      },
    );

    return response;
  }

  async updateShippingAddress(orderId, request = {}) {
    const response = await apiRequest(
      `admin/orders/${orderId}/shipping-address`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      },
    );

    return response;
  }

  async updateCustomerInfo(orderId, request = {}) {
    const response = await apiRequest(`admin/orders/${orderId}/customer-info`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }
}

export const ordersApi = new OrdersApi();
