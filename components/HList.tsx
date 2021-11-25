import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import VMedia from "./VMedia";
import { Movie, TV } from "../api";
import { FetchNext, loadMore } from "../utils";

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
  margin-bottom: 20px;
`;

export const HListSeparator = styled.View`
  width: 20px;
`;

interface HListProps {
  title: string;
  data: Movie[] | TV[] | undefined;
  hasNextPage: boolean | undefined;
  fetchNextPage: FetchNext;
}

const HList: React.FC<HListProps> = ({
  title,
  data,
  hasNextPage,
  fetchNextPage,
}) => (
  <ListContainer>
    <ListTitle>{title}</ListTitle>
    <FlatList
      data={data}
      onEndReached={() => loadMore(hasNextPage, fetchNextPage)}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={HListSeparator}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      keyExtractor={(item) => item.id + ""}
      renderItem={({ item }) => (
        <VMedia
          posterPath={item.poster_path}
          originalTitle={item.original_title ?? item.original_name}
          voteAverage={item.vote_average}
          fullData={item}
        />
      )}
    />
  </ListContainer>
);

export default HList;
