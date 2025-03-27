import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // ✅ Corrected navigation
import { Movie } from "../interfaces/interfaces"; // Ensure correct path
import starIcon from "../assets/icons/star.png"; // Ensure correct path

interface MovieCardProps {
    item: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
    const router = useRouter(); // ✅ Corrected navigation

    if (!item?.imdbID) return null; // Prevent rendering issues if ID is missing

    return (
        <TouchableOpacity
            style={{ width: "30%", paddingBottom: 10 }}
            onPress={() => router.push({ pathname: "/movies/[id]", params: { id: item.imdbID } })}// ✅ Fixed navigation
        >
            {/* Movie Poster */}
            <Image
                source={{
                    uri: item.Poster !== "N/A" ? item.Poster : "https://via.placeholder.com/300x450",
                }}
                style={{ width: "100%", height: 150, borderRadius: 10 }}
                resizeMode="cover"
            />

            {/* Movie Title */}
            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: "bold", color: "white", marginTop: 5 }}>
                {item.Title || "Unknown"}
            </Text>

            {/* IMDb Rating */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 3 }}>
                <Image source={starIcon} style={{ width: 16, height: 16, marginRight: 5 }} />
                <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
                    {item.imdbRating && item.imdbRating !== "N/A" ? item.imdbRating : "N/A"}
                </Text>
            </View>

            {/* Movie Year & Type */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                <Text style={{ fontSize: 12, color: "#aaa", fontWeight: "500" }}>{item.Year || "N/A"}</Text>
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#aaa", textTransform: "uppercase" }}>
                    {item.Type || "Movie"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default MovieCard;
