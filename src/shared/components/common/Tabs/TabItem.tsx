import React from 'react';

export type ITabItemProps = {
  children: React.ReactElement;
  label: string;
  disabled?: boolean;
  active?: boolean;
};

export function TabItem({ children }: ITabItemProps) {
  return <>{children}</>;
}
