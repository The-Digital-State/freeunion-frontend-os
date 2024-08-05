import { OrganizationShort } from './organization';

export enum PaymentType {
  fundraising = 'Добровольное пожертвование',
  subscription = 'Пакеты подписок',
  promotional = 'Ационный сбор',
}

export enum PaymentSystems {
  patreon = 'patreon',
  paypal = 'paypal',
  stripe = 'stripe',
  bitcoin = 'bitcoin',
  litecoin = 'litecoin',
  ERC20 = 'ERC20',
  other = 'other',
}

export const PaymentSystemsText = {
  [PaymentSystems.patreon]: 'Patreon',
  [PaymentSystems.paypal]: 'PayPal',
  [PaymentSystems.stripe]: 'Stripe',
  [PaymentSystems.bitcoin]: 'Bitcoin',
  [PaymentSystems.litecoin]: 'Litecoin',
  [PaymentSystems.ERC20]: 'ERC20 любая сеть',
  [PaymentSystems.other]: 'Другое',
};

export enum CurrenciesType {
  EUR = 'EUR',
  USD = 'USD',
}

export const currencyLabel = {
  [CurrenciesType.EUR]: '€',
  [CurrenciesType.USD]: '$',
};

export type Payment = {
  title: string;
  description?: string;
  image?: string;
  ammount?: number;
  currency?: CurrenciesType;
  date_end?: Date;
  manual_payments?: {
    payment_link: string;
    payment_system: PaymentSystems;
  }[];
  auto_payments?: ApiPayments[];
  type?: 0 | 1 | 2;
};

export type PaymentCreated = Payment & {
  created_at?: Date;
  id?: number;
  is_subscription?: number;
  organization?: OrganizationShort;
  collected?: number;
};

export type FilteredPaymentData = {
  title: string;
  created_at: Date;
  id: number;
  type: PaymentType;
};

// API -------------------------------------------------------------
export enum ApiPayments {
  stripe = 'stripe',
  paypal = 'paypal',
}

export type ApiPaymentType = {
  payment_system: ApiPayments;
  credentials: {
    publish_key: string;
    secret_key: string;
  };
  active: boolean;
};

export enum PaymentTypeEnum {
  fundraising,
  promotion,
  subscription,
}

export type PaymentCosts = {
  name: string;
  amount: number;
  currency: CurrenciesType;
};
