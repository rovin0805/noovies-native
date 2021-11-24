import { useNavigation } from "@react-navigation/core";
import React from "react";
import styled from "styled-components/native";
import { Movie, TV } from "../api";
import Poster from "./Poster";
import Votes from "./Votes";

const Container = styled.TouchableOpacity`
  align-items: center;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

interface VMediaProps {
  posterPath: string;
  originalTitle: string;
  voteAverage: number;
  fullData: Movie | TV;
}

const VMedia: React.FC<VMediaProps> = ({
  posterPath,
  originalTitle,
  voteAverage,
  fullData,
}) => {
  const navigation = useNavigation();
  const goToDetail = () =>
    navigation.navigate("Stack", {
      screen: "Detail",
      params: { ...fullData },
    });

  return (
    <Container onPress={goToDetail}>
      <Poster path={posterPath} />
      <Title>
        {originalTitle.slice(0, 12)}
        {originalTitle.length > 12 ? "..." : null}
      </Title>
      <Votes votes={voteAverage} />
    </Container>
  );
};

export default VMedia;
