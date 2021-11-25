import React, { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { tvApi } from "../api";
import HList from "../components/HList";
import Loader from "../components/Loader";
import { getNextPage } from "../utils";

const Tv = () => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const {
    isLoading: todayLoading,
    data: todayData,
    hasNextPage: todayHasNextPage,
    fetchNextPage: todayFetchNextPage,
  } = useInfiniteQuery(["tv", "today"], tvApi.airingToday, {
    getNextPageParam: getNextPage,
  });

  const {
    isLoading: topLoading,
    data: topData,
    hasNextPage: topHasNextPage,
    fetchNextPage: topFetchNextPage,
  } = useInfiniteQuery(["tv", "top"], tvApi.topRated, {
    getNextPageParam: getNextPage,
  });

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
  } = useInfiniteQuery(["tv", "trending"], tvApi.trending, {
    getNextPageParam: getNextPage,
  });

  const loading = todayLoading || topLoading || trendingLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["tv"]);
    setRefreshing(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 30 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <HList
        title="Trending TV"
        data={trendingData.pages.map((page) => page.results).flat()}
        hasNextPage={trendingHasNextPage}
        fetchNextPage={trendingFetchNextPage}
      />
      <HList
        title="Airing Today"
        data={todayData.pages.map((page) => page.results).flat()}
        hasNextPage={todayHasNextPage}
        fetchNextPage={todayFetchNextPage}
      />
      <HList
        title="Top Rated TV"
        data={topData.pages.map((page) => page.results).flat()}
        hasNextPage={topHasNextPage}
        fetchNextPage={topFetchNextPage}
      />
    </ScrollView>
  );
};

export default Tv;
