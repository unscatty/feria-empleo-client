import ObjectLiteral from "./object-literal.interface";

export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

export interface PaginationResponse<
  Resource,
  Meta extends ObjectLiteral = IPaginationMeta
> {
  items: Resource[];
  meta: Meta;
  links?: IPaginationLinks;
}

export interface IPaginationOptions<CustomMetaType = IPaginationMeta> {
  /**
   * the amount of items to be requested per page
   */
  limit: number | string;
  /**
   * the page that is requested
   */
  page: number | string;
  /**
   * a basic route for generating links (i.e., WITHOUT query params)
   */
  route?: string;

  /**
   * For transforming the default meta data to a custom type
   */
  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;

  /**
   * routingLabels for append in links (limit or/and page)
   */
  routingLabels?: IPaginationOptionsRoutingLabels;

  /**
   * Used for changing query method to take/skip (defaults to limit/offset if no argument supplied)
   */
  paginationType?: PaginationTypeEnum;
}

export interface IPaginationMeta extends ObjectLiteral {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export interface IPaginationLinks {
  /**
   * a link to the "first" page
   */
  first?: string;
  /**
   * a link to the "previous" page
   */
  previous?: string;
  /**
   * a link to the "next" page
   */
  next?: string;
  /**
   * a link to the "last" page
   */
  last?: string;
}

export interface IPaginationOptionsRoutingLabels {
  /**
   * the limit text to append in router string
   */
  limitLabel?: string;

  /**
   * the page text to append in router string
   */
  pageLabel?: string;
}
