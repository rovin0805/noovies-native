import React from "react";
import styled from "styled-components/native";

const View = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text``;

const Movies = ({ navigation: { navigate } }) => (
  <View onPress={() => navigate("Stack", { screen: "One" })}>
    <Title>Movies</Title>
  </View>
);

export default Movies;
