import { isMobile, getSelectorsByUserAgent } from 'react-device-detect';
import { isSSR } from '../utils/isSSR';

export class DeviceService {
  static userAgent?: string;

  get isMobile(): boolean {
    return !isSSR() ? isMobile : DeviceService.userAgent ? getSelectorsByUserAgent(DeviceService.userAgent).isMobile : undefined;
  }
}
