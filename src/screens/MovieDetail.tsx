import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import { API_ACCESS_TOKEN } from '@env'
import type { Movie } from '../types/app'
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MovieList from '../components/movies/MovieList'
import AsyncStorage from "@react-native-async-storage/async-storage";

const win = Dimensions.get("window");
export default function MovieDetail({ route }: any): JSX.Element {
  const [movie, setMovie] = useState<Movie>();
  const [isFavorite, setIsFavorite] = useState(false);

  const checkFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );

      let favMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = JSON.parse(initialData);
      }
      console.log(favMovieList);
      if (
        favMovieList.some((item) => {
          return id == item.id;
        })
      ) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      let initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );

      let favMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favMovieList));
      console.log(initialData);
      initialData = await AsyncStorage.getItem("@FavoriteList");
      console.log(initialData);
      setIsFavorite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      let initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );
      let favMovieList: Movie[] = [];
      let newMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = JSON.parse(initialData);
      }
      newMovieList = favMovieList.filter((item) => {
        return item.id != id;
      });
      console.log(initialData);
      await AsyncStorage.setItem("@FavoriteList", JSON.stringify(newMovieList));
      initialData = await AsyncStorage.getItem("@FavoriteList");
      console.log(initialData);
      setIsFavorite(false);
    } catch (error) {
      console.log(error);
    }
  };

  const { id } = route.params;

  useEffect(() => {
    getMovieDetail();
  }, []);

  useEffect(() => {
    if (movie != undefined) {
      checkFavorite(movie?.id);
    }
  }, [movie]);

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response);
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  return (
    <ScrollView>
      <View
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <ImageBackground
          resizeMode="cover"
          style={[{ width: win.width, height: 200 }]}
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`,
          }}
        >
          <LinearGradient
            colors={["#00000000", "rgba(0, 0, 0, 0.7)"]}
            locations={[0.6, 0.8]}
            style={styles.gradientStyle}
          >
            <Text style={styles.movieTitle}>{movie?.title}</Text>
            <View
              style={[
                styles.rowContainer,
                {
                  justifyContent: "space-between",
                  paddingHorizontal: 0,
                  paddingRight: 20,
                },
              ]}
            >
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color="yellow" />
                <Text style={styles.rating}>{movie?.vote_average.toFixed(1)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (movie != undefined) {
                    if (isFavorite) {
                      removeFavorite(movie.id);
                    } else {
                      addFavorite(movie);
                    }
                  }
                }}
              >
                <FontAwesome
                  name={isFavorite ? "heart" : "heart-o"}
                  size={16}
                  color="pink"
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.movieDescription}>{movie?.overview}</Text>
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.factTitle}>Original Language</Text>
            <Text>{movie?.original_language}</Text>
          </View>
          <View style={styles.columnContainer}>
            <Text style={styles.factTitle}>Popularity</Text>
            <Text>{movie?.popularity}</Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.factTitle}>Release Date</Text>
            <Text>{movie?.release_date?.toString()}</Text>
          </View>
          <View style={styles.columnContainer}>
            <Text style={styles.factTitle}>Vote Count</Text>
            <Text>{movie?.vote_count}</Text>
          </View>
        </View>
        <MovieList
          title={"Recommendations"}
          path={`movie/${id}/recommendations`}
          coverType={"poster"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    width: win.width,
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  columnContainer: {
    flexDirection: "column",
    width: 200,
  },
  movieDescription: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    textAlign: "justify",
  },
  factTitle: {
    paddingTop: 10,
    paddingBottom: 5,
    textAlign: "justify",
    fontWeight: 'bold',
  },
  movieTitle: {
    color: "white",
  },
  gradientStyle: {
    padding: 8,
    height: "100%",
    width: "100%",
    borderRadius: 8,
    display: "flex",
    justifyContent: "flex-end",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    color: "yellow",
    fontWeight: "700",
  },
})