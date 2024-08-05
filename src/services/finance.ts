import { PaymentCosts, PaymentCreated } from 'shared/interfaces/finance';
import { httpService } from 'services';
import { Api } from './http.service';

export const getFundraisings = async (organisationId: number): Promise<PaymentCreated[]> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/fundraisings`);
  return response.data.data;
};

export const getSubscriptions = async (organisationId: number): Promise<PaymentCreated[]> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/subscriptions`);
  return response.data.data;
};

export const addPaymentLink = async (
  organisationId: number,
  paymentId: number,
  summ: number,
  succesLink: string,
  cancelLink: string
): Promise<any> => {
  const response = await httpService.axios.post(`${Api.ORGANISATIONS}/${organisationId}/fundraisings/${paymentId}/link`, {
    summ: summ,
    success_url: succesLink,
    cancel_url: cancelLink,
  });
  return response.data.url;
};

export const getCosts = async (organisationId: number): Promise<PaymentCosts[]> => {
  const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/expenses`);
  return response.data.data;
};
