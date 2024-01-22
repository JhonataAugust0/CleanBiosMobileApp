import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ServiceList from '../Views/ServiceList.tsx';
import SchedulleForm from '../Views/ScheduleForm.tsx';
import ServicesHistory from '../Views/ServicesHistory.tsx';
import CameraScreen from '../Views/CameraScreen.tsx';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ServicesTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ServiceList" component={ServiceList} />
      <Tab.Screen name="SchedulleForm" component={SchedulleForm} />
      <Tab.Screen name="ServicesHistory" component={ServicesHistory} />
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

// const AppNavigator = () => {
//   const Tab = createBottomTabNavigator();
//
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Serviços" component={ServiceList} />
//         <Tab.Screen name="Agendar serviço" component={SchedulleForm} />
//         <Tab.Screen name="History" component={ServicesHistory} />
//         <Tab.Screen name="CameraScreen" component={CameraScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

export default AppNavigator;
