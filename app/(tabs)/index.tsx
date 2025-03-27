import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Movie } from "@/interfaces/interfaces";  // ✅ Correct import for Movie

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";

const Index = () => {
    const router = useRouter();

    // ✅ Explicitly type the states
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch movies on mount
    useEffect(() => {
        const getMovies = async () => {
            try {
                const response: Movie[] = await fetchMovies({ query: "Marvel" });
                setMovies(response || []); // Ensure movies is always an array
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Unknown error"));
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, []);

    return (
        <View className="flex-1 bg-primary">
            {/* Background Image */}
            <Image
                source={images.bg}
                className="absolute w-full z-0"
                resizeMode="cover"
            />

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
            >
                <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

                {/* Loading and Error Handling */}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
                ) : error ? (
                    <Text className="text-red-500 text-center mt-5">
                        Error: {error.message}
                    </Text>
                ) : movies?.length === 0 ? (
                    <Text className="text-white text-center mt-5">No movies found.</Text>
                ) : (
                    <View className="flex-1 mt-5">
                        {/* Search Bar */}
                        <SearchBar
                            onPress={() => router.push("/search")}
                            placeholder="Search for a movie"
                        />

                        {/* Movie List */}
                        <Text className="text-lg text-white font-bold mt-5 mb-3">
                            Latest Movies
                        </Text>

                        <FlatList
                            data={movies}
                            renderItem={({ item }) =>
                                item?.imdbID ? <MovieCard item={item} /> : null
                            }
                            keyExtractor={(item) => item?.imdbID || Math.random().toString()}
                            numColumns={3}
                            columnWrapperStyle={{
                                justifyContent: "flex-start",
                                gap: 20,
                                paddingRight: 5,
                                marginBottom: 10,
                            }}
                            getItemLayout={(data, index) => ({
                                length: 150, // Approximate row height
                                offset: 150 * index,
                                index,
                            })}
                            className="mt-2 pb-32"
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Index;
