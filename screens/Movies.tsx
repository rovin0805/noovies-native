import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, View, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";

const API_KEY = "ace68158018ac6621b56139a36b81e00";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TrendingContainer = styled.View`
  margin-bottom: 40px;
`;

const TrendingTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
`;

const TrendingScroll = styled.FlatList`
  margin-top: 20px;
`;

const ComingSoonTitle = styled(TrendingTitle)`
  margin-bottom: 20px;
`;

const VSeperator = styled.View`
  width: 20px;
`;
const HSeperator = styled.View`
  height: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const [loading, setLoading] = useState(true);
  const [nowPlayingMovies, setNowPlayMovies] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getNowPlaying = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
      )
    ).json();
    setNowPlayMovies(results);
  };
  const getUpcoming = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
      )
    ).json();
    setUpcoming(results);
  };
  const getTrending = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      )
    ).json();
    setTrending(results);
  };
  const getAllData = async () => {
    await Promise.all([getTrending(), getUpcoming(), getNowPlaying()]);
    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllData();
    setRefreshing(false);
  };

  const rederVMedia = ({ item }) => (
    <VMedia
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      voteAverage={item.vote_average}
    />
  );

  const renderHMedia = ({ item }) => (
    <HMedia
      key={item.id}
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      overview={item.overview}
      releaseDate={item.release_date}
    />
  );

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              width: "100%",
              height: SCREEN_HEIGHT / 4,
              marginBottom: 20,
            }}
          >
            {nowPlayingMovies.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path}
                posterPath={movie.poster_path}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
              />
            ))}
          </Swiper>
          <TrendingContainer>
            <TrendingTitle>Trending Movies</TrendingTitle>
            <TrendingScroll
              data={trending}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              ItemSeparatorComponent={VSeperator}
              renderItem={rederVMedia}
            />
          </TrendingContainer>
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcoming}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={HSeperator}
      renderItem={renderHMedia}
    />
  );
};

export default Movies;
