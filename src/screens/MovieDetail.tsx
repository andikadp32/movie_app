import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native'
import { API_ACCESS_TOKEN } from '@env'
import type { Movie } from '../types/app'
import MovieList from '../components/movies/MovieList'

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params
  const [movie, setMovie] = useState<Movie | null>(null)
  const [recommendations, setRecommendations] = useState<Movie[]>([])

  useEffect(() => {
    fetchMovieDetail()
    fetchRecommendations()
  }, [id])

  const fetchMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`
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
        setMovie(response)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const fetchRecommendations = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations`
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
        setRecommendations(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.backdrop}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` }}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
        <Text style={styles.info}>
          Original Language: {movie.original_language}
        </Text>
        <Text style={styles.info}>
          Release Date: {new Date(movie.release_date).toDateString()}
        </Text>
        <Text style={styles.info}>Vote Count: {movie.vote_count}</Text>
        <Text style={styles.info}>Popularity: {movie.popularity.toFixed(2)}</Text>
        {recommendations.length > 0 && (
          <MovieList
            title="Recommendation"
            path={`movie/${id}/recommendations`}
            coverType="poster"
            movies={recommendations}
          />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backdrop: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 18,
    marginVertical: 8,
  },
  overview: {
    fontSize: 16,
    marginVertical: 8,
  },
  info: {
    fontSize: 14,
    marginVertical: 4,
  },
})

export default MovieDetail