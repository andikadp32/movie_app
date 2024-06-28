import { API_ACCESS_TOKEN } from "@env";
import { useState } from "react";
import { View, TextInput, FlatList, Dimensions } from "react-native";
import { Movie } from "../../types/app";
import MovieItem from "../movies/MovieItem";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/FontAwesome';

const win = Dimensions.get("window");
export default function KeywordSearch() {
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovies(response.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };
  return (
    <SafeAreaView style={{ alignItems: "center" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          paddingVertical: 15,
          paddingHorizontal: 15,
          borderRadius: 999,
          width: "100%",
        }}>   
          <TextInput
            style={{
              flex: 1,
              paddingLeft: 10,
              fontSize: 16,
            }}
            placeholder="Input title movie here"
            onSubmitEditing={() => {
              getMovieDetail();
            }}
            onChangeText={(text) => {
              setKeyword(text);
            }}
            value={keyword}
          />
          <Icon name="search" size={20} style={{ marginRight: 10 }} />
        </View>
      </View>
      <FlatList
        style={{
          marginTop: 20,
          marginBottom: 420,
          width: win.width,
        }}
        contentContainerStyle={{
          alignItems: "center",
        }}
        data={movies}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <MovieItem
              movie={item}
              size={{
                width: 100,
                height: 160,
              }}
              coverType={"poster"}
            />
          </View>
        )}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}