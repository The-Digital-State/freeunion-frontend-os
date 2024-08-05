import { HttpService } from './http.service';
import { DictionariesService } from './dictionaries.service';
import { AuthService } from './auth.service';
import { InviteLinksService } from './invite-links.service';
import { UserService } from './user.service';
import { OrganisationsService } from './organisations.service';
import { SuggestionsService } from './suggestions.service';
import { DeviceService } from './device.service';
import { ScrollService } from './scroll.service';
import { NavigationBuilder } from './navigation.builder';

const httpService = new HttpService();
const dictionariesService = new DictionariesService(httpService);
const authService = new AuthService(httpService);
const inviteLinksService = new InviteLinksService(httpService);
const userService = new UserService(httpService);
const organisationsService = new OrganisationsService(httpService);
const suggestionsService = new SuggestionsService(httpService);
const deviceService = new DeviceService();
const scrollService = new ScrollService();
const navigationBuilder = new NavigationBuilder();

export {
  httpService,
  dictionariesService,
  authService,
  inviteLinksService,
  userService,
  organisationsService,
  suggestionsService,
  deviceService,
  scrollService,
  navigationBuilder,
};
