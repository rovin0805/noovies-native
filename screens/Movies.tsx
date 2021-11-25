import React, { useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import HMedia from "../components/HMedia";
import Slide from "../components/Slide";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { MovieResponse, moviesApi } from "../api";
import Loader from "../components/Loader";
import HList from "../components/HList";
import { getNextPage, loadMore } from "../utils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TrendingTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
`;

const ComingSoonTitle = styled(TrendingTitle)`
  margin-bottom: 20px;
`;

const HSeperator = styled.View`
  height: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading: nowPlayingLoading, data: nowPlayingData } =
    useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "trending"],
    moviesApi.trending,
    { getNextPageParam: getNextPage }
  );

  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNextPage,
    fetchNextPage: upcomingFetchNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "upcoming"],
    moviesApi.upcoming,
    {
      getNextPageParam: getNextPage,
    }
  );

  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };

  return loading ? (
    <Loader />
  ) : upcomingData ? (
    <FlatList
      onEndReached={() => loadMore(upcomingHasNextPage, upcomingFetchNextPage)}
      showsVerticalScrollIndicator={false}
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
            {nowPlayingData?.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          {trendingData ? (
            <HList
              title="Trending Movies"
              data={trendingData.pages.map((page) => page.results).flat()}
              hasNextPage={trendingHasNextPage}
              fetchNextPage={trendingFetchNextPage}
            />
          ) : null}
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcomingData.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={HSeperator}
      renderItem={({ item }) => (
        <HMedia
          key={item.id}
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    />
  ) : null;
};

export default Movies;
