import { Client, Databases, ID, Query } from "react-native-appwrite";
import {
    EXPO_PUBLIC_OMDB_API_KEY,
    EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    EXPO_PUBLIC_APPWRITE_COLLECTION_ID
} from "@env"; // Import directly from @env

// Appwrite Configuration
const PROJECT_ID = EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = EXPO_PUBLIC_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);

const database = new Databases(client);

// Fetch Movie Details from OMDb API
export const fetchMovieFromOMDb = async (title: string) => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${EXPO_PUBLIC_OMDB_API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            return {
                id: data.imdbID,
                title: data.Title,
                year: data.Year,
                poster: data.Poster,
                type: data.Type,
                imdbRating: data.imdbRating,
            };
        } else {
            throw new Error(data.Error);
        }
    } catch (error) {
        console.error("Error fetching movie from OMDb:", error);
        return null;
    }
};

// Update Search Count in Appwrite
export const updateSearchCount = async (query: string) => {
    try {
        const movie = await fetchMovieFromOMDb(query);
        if (!movie) return;

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("searchTerm", query),
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                year: movie.year,
                count: 1,
                poster_url: movie.poster,
                type: movie.type,
                imdbRating: movie.imdbRating,
            });
        }
    } catch (error) {
        console.error("Error updating search count:", error);
        throw error;
    }
};

// Get Trending Movies from Appwrite
export const getTrendingMovies = async (): Promise<any[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ]);

        return result.documents;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return undefined;
    }
};
