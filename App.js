import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import MonthlyScreen from './src/MonthlyScreen';
import YearlyScreen from './src/YearlyScreen';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Monthly" component={MonthlyScreen} />
        <Stack.Screen name="Yearly" component={YearlyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;