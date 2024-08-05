import { Api, HttpService } from './http.service';
import { ISuggestion, SuggestionVotesVariant } from '../interfaces/suggestion.interface';

export class SuggestionsService {
  constructor(private httpService: HttpService) {}

  async getSuggestions(organisationId: number): Promise<ISuggestion[]> {
    const response = await this.httpService.axios.get<{ data: ISuggestion[] }>(`${Api.ORGANIZATION}/${organisationId}/suggestions`);
    return response.data.data;
  }

  async getSuggestion(organisationId: number, suggestionId: number): Promise<ISuggestion> {
    const response = await this.httpService.axios.get<{ data: ISuggestion }>(
      `${Api.ORGANIZATION}/${organisationId}/suggestions/${suggestionId}`
    );
    return response.data.data;
  }

  async createSuggestion(organisationId: number, suggestion: any): Promise<ISuggestion> {
    const response = await this.httpService.axios.post<{ data: ISuggestion }>(
      `${Api.ORGANIZATION}/${organisationId}/suggestions`,
      suggestion
    );

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'suggestion',
        action: 'add',
      },
    });

    return response.data.data;
  }

  async updateSuggestion(organisationId: number, suggestion: any, suggestionId: number): Promise<ISuggestion> {
    const response = await this.httpService.axios.put<{ data: ISuggestion }>(
      `${Api.ORGANIZATION}/${organisationId}/suggestions/${suggestionId}`,
      suggestion
    );
    return response.data.data;
  }

  async deleteSuggestion(organisationId: number, suggestionId: number): Promise<ISuggestion> {
    const response = await this.httpService.axios.delete<{ data: ISuggestion }>(
      `${Api.ORGANIZATION}/${organisationId}/suggestions/${suggestionId}`
    );
    return response.data.data;
  }

  async vote(suggestionId: number): Promise<any> {
    const response = await this.httpService.axios.post<any>(`${Api.SUGGESTIONS}/${suggestionId}/reaction`, {
      reaction: SuggestionVotesVariant.thumbs_up,
    });

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'suggestion',
        action: 'vote',
      },
    });

    return response.data.data;
  }

  async unvote(suggestionId: number): Promise<any> {
    const response = await this.httpService.axios.post<any>(`${Api.SUGGESTIONS}/${suggestionId}/reaction`, { reaction: -1 });

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'suggestion',
        action: 'unvote',
      },
    });

    return response.data.data;
  }

  async react(suggestionId: number, reaction: SuggestionVotesVariant): Promise<any> {
    const response = await this.httpService.axios.post<any>(`${Api.SUGGESTIONS}/${suggestionId}/reaction`, { reaction: reaction });

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'suggestion',
        label: reaction,
        action: 'react',
      },
    });

    return response.data.data;
  }

  private key = 'needSuggestionSwipeTraining';

  set needSuggestionSwipeTraining(value) {
    if (value === undefined) {
      localStorage.removeItem(this.key);
      return;
    }
    localStorage.setItem(this.key, String(value));
  }

  get needSuggestionSwipeTraining(): boolean {
    return Boolean(localStorage.getItem(this.key));
  }
}
