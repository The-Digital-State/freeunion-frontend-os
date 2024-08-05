import { TabItem } from 'shared/components/common/Tabs/TabItem';
import { Tabs } from 'shared/components/common/Tabs/Tabs';
import { CurrenciesType, PaymentCosts, PaymentCreated } from 'shared/interfaces/finance';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCosts, getFundraisings } from 'services/finance';
import formatServerError from 'utils/formatServerError';
import styles from './Finance.module.scss';
import { Payments } from './Payments/Payments';
import Costs from './Costs/Costs';

enum FinanceTabConfig {
  payments = 'payments',
  myFinance = 'myFinance',
}

export const currencyLabel = {
  [CurrenciesType.EUR]: '€',
  [CurrenciesType.USD]: '$',
};

function Finance({ organisationId }: { organisationId: number }) {
  const [activeTab, setActiveTab] = useState<any>();
  const [payments, setPayments] = useState<PaymentCreated[]>([]);
  const [costs, setCosts] = useState<PaymentCosts[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const fundraisings = await getFundraisings(+organisationId);
        setPayments(fundraisings);
        const response = await getCosts(+organisationId);
        setCosts(response);
      } catch (e) {
        toast.error(formatServerError(e));
        console.log(formatServerError(e));
      }
    })();
  }, [organisationId]);

  const filterPayments = payments?.filter((i) => !!i.auto_payments?.length || !!i.manual_payments?.length);

  if (!filterPayments?.length && !costs?.length) {
    return null;
  }

  const tabsConfig = [
    !!filterPayments?.length && { id: 1, label: 'Платежи', type: FinanceTabConfig.payments },
    !!costs?.length && { id: 2, label: 'Расходы', type: FinanceTabConfig.myFinance },
  ];

  return (
    <div className={styles.wrapper} id="finance">
      <h2>Финансы</h2>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        {tabsConfig
          .filter((tab) => !!tab.id)
          .map((tab) => {
            return (
              <TabItem label={tab.label} key={tab.id}>
                {(() => {
                  switch (tab.type) {
                    case FinanceTabConfig.payments:
                      return <Payments payments={filterPayments} />;
                    case FinanceTabConfig.myFinance:
                      return !!costs?.length && <Costs costs={costs} />;
                  }
                })()}
              </TabItem>
            );
          })}
      </Tabs>
    </div>
  );
}

export default Finance;
