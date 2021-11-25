import { InfiniteQueryObserverResult } from "react-query";
import { MovieResponse, TVResponse } from "./api";

export const makeImgPath = (img: string, width: string = "w500") =>
  `https://image.tmdb.org/t/p/${width}${img}`;

type MovieFetch = Promise<InfiniteQueryObserverResult<MovieResponse, unknown>>;
type TVFetch = Promise<InfiniteQueryObserverResult<TVResponse, unknown>>;

export type FetchNext = () => MovieFetch | TVFetch;

export const getNextPage = (currentPage: MovieResponse) => {
  const nextPage = currentPage.page + 1;
  return nextPage > currentPage.total_pages ? null : nextPage;
};

export const loadMore = (
  hasNextPage: boolean | undefined,
  fetchNextPage: FetchNext
) => (hasNextPage ? fetchNextPage() : null);
