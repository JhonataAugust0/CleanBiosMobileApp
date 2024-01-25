import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ServiceList from '../Views/ServiceList.tsx';
import SchedulleForm from '../Views/ScheduleForm.tsx';
import ServicesHistory from '../Views/ServicesHistory.tsx';
import CameraScreen from '../Views/CameraScreen.tsx';

const ServicesTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ServiceList"
        component={ServiceList}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Icon name="home" size={20} color="black" />,
        }}
      />
      <Tab.Screen
        name="SchedulleForm"
        component={SchedulleForm}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: () => <Icon name="calendar-edit" size={20} color="black" />,
        }}
      />
      <Tab.Screen
        name="ServicesHistory"
        component={ServicesHistory}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: () => <Icon name="history" size={20} color="black" />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ServicesTab"
          component={ServicesTab}
          options={{headerShown: false}}
        />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
