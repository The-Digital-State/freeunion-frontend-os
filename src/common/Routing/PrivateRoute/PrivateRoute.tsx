import { useContext } from 'react';
import { RouteProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import { routes } from 'Routes';
import { GlobalDataContext } from 'contexts/GlobalDataContext';
import { SimpleRoutingContainer } from '../SimpleRoutingContainer/SimpleRoutingContainer';

type IPrivateRouteProps = RouteProps & {
  children?: any;
  withSidebar?: boolean;
  withFooter?: boolean;
  showCloseButton?: boolean;
  closeButtonRoute?: typeof routes;
};

export function PrivateRoute({ children }: IPrivateRouteProps) {
  const { auth, user } = useContext(GlobalDataContext);

  const isLoggedIn = !!user;

  if (auth.isLoading) {
    return <SimpleRoutingContainer hideFooter></SimpleRoutingContainer>;
  }

  if (!isLoggedIn) {
    // toast.error('Необходимо авторизоваться');
    return <Redirect to={routes.LOGIN} />;
  }

  return children;
}
