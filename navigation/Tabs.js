import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movies";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        marginTop: -5,
        fontSize: 10,
        fontWeight: "600",
      },
    }}
  >
    <Tab.Screen
      name="Movies"
      component={Movies}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={"film-outline"} color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Tv"
      component={Tv}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="tv-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={"search-outline"} color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Tabs;
