import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import AdminHomeScreen from './AdminHomeScreen';
import EventManager from './AdminEventsScreen';
import AnnouncementSender from './AdminAnnouncementScreen';
import AdminProfileScreen from './AdminProfileScreen';

const Tab = createBottomTabNavigator();

const AdminPanel = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Anasayfa"
        component={AdminHomeScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="stats-chart-outline" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Etkinlikler"
        component={EventManager}
        options={{ tabBarIcon: ({ color }) => <Icon name="calendar-outline" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Duyurular"
        component={AnnouncementSender}
        options={{ tabBarIcon: ({ color }) => <Icon name="megaphone-outline" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Profil"
        component={AdminProfileScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="person-circle-outline" size={22} color={color} /> }}
      />
    </Tab.Navigator>
  );
};

export default AdminPanel;
