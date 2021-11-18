import React from "react";
import { ActivityIndicator, Dimensions, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import { useQuery, useQueryClient } from "react-query";
import { moviesApi } from "../api";

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
  const queryClient = useQueryClient();
  const {
    isLoading: nowPlayingLoading,
    data: nowPlayingData,
    isRefetching: isRefetchingNowPlaying,
  } = useQuery(["movies", "nowPlaying"], moviesApi.nowPlaying);
  const {
    isLoading: trendingLoading,
    data: trendingData,
    isRefetching: isRefetchingTrending,
  } = useQuery(["movies", "trending"], moviesApi.trending);
  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    isRefetching: isRefetchingUpcoming,
  } = useQuery(["movies", "upcoming"], moviesApi.upcoming);
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
  const refreshing =
    isRefetchingNowPlaying || isRefetchingUpcoming || isRefetchingTrending;

  const onRefresh = () => {
    queryClient.refetchQueries(["movies"]);
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
            {nowPlayingData.results.map((movie) => (
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
              data={trendingData.results}
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
      data={upcomingData.results}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={HSeperator}
      renderItem={renderHMedia}
    />
  );
};

export default Movies;
