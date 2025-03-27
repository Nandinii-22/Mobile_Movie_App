// Interface for a single movie (used in search results)
interface Movie {
  imdbID: string; // Unique ID of the movie
  Title: string; // Movie title
  Year: string; // Release year
  Type: string; // Movie, series, or episode
  Poster: string; // URL to movie poster
  imdbRating?: string; // Optional: IMDb rating (Only available in movie details API)
}

// Interface for a single movie with detailed information (OMDb API response)
interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

// Interface for a trending movie (assuming it is based on search popularity)
interface TrendingMovie {
  searchTerm: string; // Search term used to find the movie
  imdbID: string; // IMDb ID of the movie
  Title: string; // Movie title
  count: number; // Number of times searched (custom logic)
  poster_url: string; // Movie poster URL
}

// Props interface for TrendingMovieCard component
interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

export type { Movie, MovieDetails, TrendingMovie, TrendingCardProps };
