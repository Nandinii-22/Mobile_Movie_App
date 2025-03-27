export const OMDB_CONFIG = {
    BASE_URL: "https://www.omdbapi.com/",
    API_KEY: "f60d6bd3", // Replace with your actual API key
};

// Interface for Movie (OMDb API Response)
export interface Movie {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
    Type: string;
    imdbRating?: string;
}

// Interface for Movie Details
export interface MovieDetails {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
    Type: string;
    imdbRating: string;
    Plot?: string;
    Genre?: string;
    Runtime?: string;
    Director?: string;
    Actors?: string;
}

// Predefined list of popular movies (to fetch when no search query is provided)
const defaultMovieTitles = [
    "Inception",
    "Interstellar",
    "The Dark Knight",
    "Titanic",
    "The Matrix",
    "Avatar",
    "Forrest Gump",
    "The Shawshank Redemption",
    "Gladiator",
    "Fight Club"
];

// Function to fetch movies based on a search query
export const fetchMovies = async ({ query }: { query: string }): Promise<Movie[]> => {
    if (!query) {
        // Fetch movies from the predefined list when no query is provided
        const randomMovies = defaultMovieTitles.sort(() => 0.5 - Math.random()).slice(0, 5); // Pick 5 random movies
        const moviePromises = randomMovies.map(title => fetchMoviesByTitle(title));
        return Promise.all(moviePromises).then(results => results.flat());
    }

    return fetchMoviesByTitle(query);
};

// Helper function to fetch movies by title
const fetchMoviesByTitle = async (title: string): Promise<Movie[]> => {
    const endpoint = `${OMDB_CONFIG.BASE_URL}?apikey=${OMDB_CONFIG.API_KEY}&s=${encodeURIComponent(title)}`;

    const response: Response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data: any = await response.json();
    if (data.Response === "False") {
        throw new Error(`Error fetching movies: ${data.Error}`);
    }

    // Fetch additional details (IMDb rating, Plot, etc.) for each movie
    const moviesWithDetails: Movie[] = await Promise.all(
        data.Search.map(async (movie: any): Promise<Movie> => {
            const details = await fetchMovieDetails(movie.imdbID);
            return {
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/300x450/1a1a1a/FFFFFF.png",
                Year: movie.Year,
                Type: movie.Type,
                imdbRating: details.imdbRating || "N/A",
            };
        })
    );

    return moviesWithDetails;
};

// Function to fetch detailed information about a movie using its IMDb ID
export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
    try {
        const response = await fetch(
            `${OMDB_CONFIG.BASE_URL}?apikey=${OMDB_CONFIG.API_KEY}&i=${movieId}&plot=full`,
            { method: "GET" }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.statusText}`);
        }

        const data: any = await response.json();
        if (data.Response === "False") {
            throw new Error(`Error fetching movie details: ${data.Error}`);
        }

        return {
            imdbID: data.imdbID,
            Title: data.Title,
            Poster: data.Poster !== "N/A" ? data.Poster : "https://placehold.co/300x450/1a1a1a/FFFFFF.png",
            Year: data.Year,
            Type: data.Type,
            imdbRating: data.imdbRating || "N/A",
            Plot: data.Plot || "No plot available",
            Genre: data.Genre || "Unknown",
            Runtime: data.Runtime || "Unknown",
            Director: data.Director || "Unknown",
            Actors: data.Actors || "Unknown",
        };
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw error;
    }
};
