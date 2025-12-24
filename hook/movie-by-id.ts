export interface MovieTypes {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  tagline: string;
  runtime: number;
  genres: GenreTypes[];
  credits: CreditsTypes;
  images: ImagesTypes;
  videos: VideosTypes;
  recommendations: RecommendationsTypes;
  reviews: ReviewsTypes;
  first_air_date: string;
  name: string;
  media_type: string;
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  seasons: Season[];
  vote_count: number;
  popularity: number;
  external_ids: ExternalIdsTypes;
  original_language: string;
}
interface ExternalIdsTypes {
  imdb_id: string;
}
export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}
export interface GenreTypes {
  id: number;
  name: string;
}

export interface CreditsTypes {
  cast: CastMemberTypes[];
  crew: CrewMemberTypes[];
}

export interface CastMemberTypes {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMemberTypes {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface ImagesTypes {
  backdrops: ImageTypes[];
  logos: ImageTypes[];
  posters: ImageTypes[];
}

export interface ImageTypes {
  file_path: string;
  aspect_ratio: number;
  height: number;
  width: number;
  vote_average: number;
  iso_639_1: string;
}

export interface VideosTypes {
  results: VideoTypes[];
}

export interface VideoTypes {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface RecommendationsTypes {
  results: RecommendedMovieTypes[];
}

export interface RecommendedMovieTypes {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  media_type: string;
  first_air_date: string;
  name: string;
}

export interface ReviewsTypes {
  results: ReviewTypes[];
}

export interface ReviewTypes {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number | null;
  };
}

export interface SeasonTypes {
  _id: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  vote_average: number;
  episodes: EpisodeTypes[];
  networks: NetworkTypes[];
}

export interface EpisodeTypes {
  id: number;
  name: string;
  overview: string;
  air_date: string;
  episode_number: number;
  episode_type: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  production_code: string;
  crew: CrewMemberTypes[];
  guest_stars: GuestStarTypes[];
}

export interface CrewMemberTypes {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
  popularity: number;
  profile_path: string | null;
}

export interface GuestStarTypes {
  id: number;
  name: string;
  original_name: string;
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  popularity: number;
  profile_path: string | null;
}

export interface NetworkTypes {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}
