import qs from 'qs';
import { Action, InterceptorInterface } from 'routing-controllers';

export class PaginationInterceptor implements InterceptorInterface {

  createQuery(path: string, obj: { [key: string]: any }) {
    return `//${path}?${qs.stringify(obj)}`;
  }

  intercept(
    action: Action,
    result: { page: number, totalCount: number, count: number, perPage: number, items: any[] },
  ) {
    const page = result.page || 1;
    const url = `${action.request.headers.host}${action.request.url}`;
    const baseQuery = { page, perPage: result.perPage };
    const lastPage = Math.ceil(result.totalCount / result.perPage);
    return {
      page,
      totalCount: result.totalCount,
      count: result.count,
      perPage: result.perPage,
      firstPage: this.createQuery(url, { ...baseQuery, page: 1 }),
      lastPage: this.createQuery(url, { ...baseQuery, page: lastPage }),
      prevPage: page > 1 ? this.createQuery(url, { ...baseQuery, page: page - 1 }) : null,
      nextPage: page < lastPage ? this.createQuery(url, { ...baseQuery, page: page + 1 }) : null,
      currentPage: this.createQuery(url, { ...baseQuery }),
      items: result.items,
    };
  }

}
