import { NewsInterface } from 'shared/interfaces/news';
import { RequestMeta } from 'interfaces/request-meta.interface';
import { httpService } from 'services';
import { Api } from './http.service';
import { getCommentsCount } from './commento.service';

export type getNewsFilters = {
  sortBy?: 'popular' | 'id';
  limit?: number;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  tags?: string[];
  featured?: number;
};

export type getOrgNewsFilter = getNewsFilters & {
  organisationId: number;
};

export const getNews = async ({
  sortBy = 'id',
  limit,
  sortDirection = 'desc',
  page = 1,
  featured,
  tags,
}: getNewsFilters): Promise<{ data: NewsInterface[]; meta: RequestMeta }> => {
  const response = await httpService.axios.get(`${Api.NEWS}`, { params: { page, limit, sortDirection, sortBy, tags, featured } });
  const news = response.data.data;
  const paths = news.map((item) => {
    return `news-${item.organization.id}-${item.id}`;
  });
  const counts = await getCommentsCount(paths);
  news.forEach((item) => {
    const path = `news-${item.organization.id}-${item.id}`;
    item.commentsCount = counts[path] ?? 0;
  });
  return { data: news, meta: response.data.meta };
};

export const getOrganisationNews = async ({
  organisationId,
  sortBy = 'id',
  limit,
  sortDirection = 'desc',
  page = 1,
}: getOrgNewsFilter): Promise<{ data: NewsInterface[]; meta: RequestMeta }> => {
  try {
    const response = await httpService.axios.get(`${Api.ORGANISATIONS}/${organisationId}/news`, {
      params: { organization_id: organisationId, sortDirection: sortDirection, limit: limit, sortBy, page },
    });
    const news = response.data.data;
    const paths = news.map((item) => {
      return `news-${item.organization.id}-${item.id}`;
    });
    const counts = await getCommentsCount(paths);
    news.forEach((item) => {
      const path = `news-${item.organization.id}-${item.id}`;
      item.commentsCount = counts[path] ?? 0;
    });
    return { data: news, meta: response.data.meta };
  } catch (e) {
    return e.response.data;
  }
};

interface suggestNewsArgs {
  title: string;
  content: string;
  preview?: string;
  comment?: string;
}

export async function suggestNews(organisationId, news: suggestNewsArgs) {
  const {
    data: { data },
  } = await httpService.axios.post(`${Api.ORGANISATIONS}/${organisationId}/news`, news);
  return data;
}
