import { MovieTypes } from "./movie-by-id";

export interface ApiTypes {
  page: number;
  results: MovieTypes[];
  total_pages: number;
  total_results: number;
}
export interface ReusablePropTypes {
  endpoint: string;
  params?: Record<string, string | number>;
  title: string;
  label?: string;
}
