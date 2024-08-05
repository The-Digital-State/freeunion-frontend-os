import { IModalOptions } from 'contexts/GlobalContext';
import { AuthService } from 'services/auth.service';
import { IGlobalDataState } from 'contexts/GlobalDataContext';
import * as H from 'history';


export type RegovSSILoginProps = {
  openModal: (options?: Pick<IModalOptions, 'params'>) => void;
  closeModal: () => void;
  authService: AuthService;
  auth: IGlobalDataState['auth'];
  history: H.History<H.LocationState>
};

export type RegovSSIRegistrationProps = {
  openModal: (options?: Pick<IModalOptions, 'params'>) => void;
  closeModal: () => void;
};
