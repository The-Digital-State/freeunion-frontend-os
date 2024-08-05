import { Api, HttpService } from './http.service';
import { ICountry } from '../interfaces/country.interface';
import { IScopeOfActivity } from '../interfaces/scope-of-activity.interface';
import { IPlace } from '../interfaces/place.interface';
import { IInterestScopes, IOrganisationTypes } from '../interfaces';
import axios, { CancelTokenSource } from 'axios';

export class DictionariesService {
  constructor(private httpService: HttpService) {}

  async getCountries(): Promise<ICountry[]> {
    const response = await this.httpService.axios.get<ICountry[]>(Api.COUNTRIES);
    response.data.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
    const index = response.data.findIndex((country) => country.id === 'BY');
    const by = response.data[index];
    response.data.splice(index, 1);
    response.data.unshift(by);
    return response.data.filter((c) => c.name !== 'country.XK');
  }

  async getActivityScopes(): Promise<IScopeOfActivity[]> {
    const response = await this.httpService.axios.get(Api.ACTIVITY_SCOPES);

    return response.data;
  }

  searchPlaceCancelTokenSource: CancelTokenSource;
  async searchPlace(name: string): Promise<IPlace[]> {
    try {
      if (this.searchPlaceCancelTokenSource) {
        this.searchPlaceCancelTokenSource.cancel();
        this.searchPlaceCancelTokenSource = null;
      }

      this.searchPlaceCancelTokenSource = axios.CancelToken.source();
      const params = new URLSearchParams({ name });
      const response = await this.httpService.axios.get(Api.SEARCH_PLACE, {
        cancelToken: this.searchPlaceCancelTokenSource.token,
        params,
      });

      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getOrganisationTypes(): Promise<IOrganisationTypes[]> {
    const response = await this.httpService.axios.get(Api.ORGANISATION_TYPES);
    return response.data;
  }

  async getInterestScopes(): Promise<IInterestScopes[]> {
    try {
      const response = await this.httpService.axios.get(Api.INTEREST_SCOPES);
      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
}
