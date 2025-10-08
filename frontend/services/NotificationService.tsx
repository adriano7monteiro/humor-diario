import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      console.log('🔔 Checking device compatibility...');
      console.log('🔔 Device.isDevice:', Device.isDevice);
      console.log('🔔 Platform.OS:', Platform.OS);
      
      if (!Device.isDevice) {
        console.log('🔔 Must use physical device for Push Notifications, but continuing for web testing...');
        // For web testing, we'll continue instead of returning false
        if (Platform.OS !== 'web') {
          return false;
        }
      }

      console.log('🔔 Getting existing permissions...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log('🔔 Existing permission status:', existingStatus);
      
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        console.log('🔔 Requesting new permissions...');
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('🔔 New permission status:', status);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('🔔 Failed to get permission for push notifications! Final status:', finalStatus);
        return false;
      }

      console.log('✅ Notification permissions granted successfully');
      return true;
    } catch (error) {
      console.log('❌ Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleHumorReminder(): Promise<void> {
    try {
      // Cancel existing humor reminder
      await this.cancelNotification('humor_reminder');

      // Schedule new humor reminder for 6 PM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💙 Como você está se sentindo?',
          body: 'Que tal registrar seu humor hoje? Isso ajuda no seu autocuidado!',
          data: { type: 'mood_reminder' },
          sound: 'default',
        },
        trigger: {
          hour: 18,
          minute: 0,
          repeats: true,
        },
        identifier: 'humor_reminder',
      });

      console.log('Humor reminder scheduled for 6 PM daily');
    } catch (error) {
      console.log('Error scheduling humor reminder:', error);
    }
  }

  static async scheduleMissionReminder(): Promise<void> {
    try {
      // Cancel existing mission reminder
      await this.cancelNotification('mission_reminder');

      // Schedule mission reminder for 10 AM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Suas missões te esperam!',
          body: 'Complete suas missões de autocuidado e ganhe XP hoje!',
          data: { type: 'mission_reminder' },
          sound: 'default',
        },
        trigger: {
          hour: 10,
          minute: 0,
          repeats: true,
        },
        identifier: 'mission_reminder',
      });

      console.log('Mission reminder scheduled for 10 AM daily');
    } catch (error) {
      console.log('Error scheduling mission reminder:', error);
    }
  }

  static async scheduleEveningReminder(): Promise<void> {
    try {
      // Cancel existing evening reminder
      await this.cancelNotification('evening_reminder');

      // Schedule evening reminder for 8 PM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌙 Momento de reflexão',
          body: 'Que tal completar suas atividades de bem-estar antes de dormir?',
          data: { type: 'evening_reminder' },
          sound: 'default',
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
        identifier: 'evening_reminder',
      });

      console.log('Evening reminder scheduled for 8 PM daily');
    } catch (error) {
      console.log('Error scheduling evening reminder:', error);
    }
  }

  static async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.log(`Error canceling notification ${identifier}:`, error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications canceled');
    } catch (error) {
      console.log('Error canceling all notifications:', error);
    }
  }

  static async setStorageItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('AsyncStorage failed, using localStorage:', error);
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      }
    }
  }

  static async getStorageItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log('AsyncStorage failed, using localStorage:', error);
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return null;
    }
  }

  static async enableReminders(): Promise<boolean> {
    try {
      console.log('🔔 NotificationService: Starting enableReminders...');
      console.log('🔔 Platform:', Platform.OS);
      
      // For web platform, we'll simulate success but not actually schedule notifications
      if (Platform.OS === 'web') {
        console.log('🔔 Running on web - notifications not fully supported, simulating success');
        await this.setStorageItem('@notifications_enabled', 'true');
        console.log('✅ Web notifications preference saved (simulated)');
        return true;
      }
      
      const hasPermission = await this.requestPermissions();
      console.log('🔔 NotificationService: Permission result:', hasPermission);
      
      if (!hasPermission) {
        console.log('🔔 NotificationService: No permission granted, returning false');
        return false;
      }

      // Schedule all reminders
      console.log('🔔 NotificationService: Scheduling reminders...');
      await this.scheduleMissionReminder();
      await this.scheduleHumorReminder();
      await this.scheduleEveningReminder();

      // Save reminder preference
      console.log('🔔 NotificationService: Saving preference to storage...');
      await this.setStorageItem('@notifications_enabled', 'true');

      console.log('✅ NotificationService: All reminders enabled successfully');
      return true;
    } catch (error) {
      console.log('❌ NotificationService: Error enabling reminders:', error);
      return false;
    }
  }

  static async disableReminders(): Promise<void> {
    try {
      await this.cancelAllNotifications();
      await this.setStorageItem('@notifications_enabled', 'false');
      console.log('Reminders disabled');
    } catch (error) {
      console.log('Error disabling reminders:', error);
    }
  }

  static async areRemindersEnabled(): Promise<boolean> {
    try {
      const enabled = await this.getStorageItem('@notifications_enabled');
      return enabled === 'true';
    } catch (error) {
      console.log('Error checking reminder status:', error);
      return false;
    }
  }

  static async sendImmediateNotification(title: string, body: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.log('Error sending immediate notification:', error);
    }
  }

  // Check if user completed daily activities
  static async checkDailyProgress(hasMoodToday: boolean, completedMissions: number): Promise<void> {
    try {
      const now = new Date();
      const hour = now.getHours();

      // Don't send notifications late at night or early morning
      if (hour < 8 || hour > 22) {
        return;
      }

      // Send contextual reminders based on user progress
      if (!hasMoodToday && hour >= 18) {
        await this.sendImmediateNotification(
          '💙 Registre seu humor',
          'Como foi seu dia hoje? Que tal registrar seu humor?'
        );
      }

      if (completedMissions === 0 && hour >= 16 && hour <= 20) {
        await this.sendImmediateNotification(
          '🎯 Missões pendentes',
          'Você ainda pode completar suas missões de bem-estar hoje!'
        );
      }

      if (completedMissions < 3 && !hasMoodToday && hour >= 19) {
        await this.sendImmediateNotification(
          '🌟 Últimos momentos do dia',
          'Que tal finalizar o dia cuidando do seu bem-estar?'
        );
      }
    } catch (error) {
      console.log('Error checking daily progress:', error);
    }
  }

  // Setup notification listeners
  static setupNotificationListeners(navigation: any): void {
    // Handle notification received while app is in foreground
    const foregroundListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Handle notification tapped
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data?.type === 'mood_reminder') {
        navigation.navigate('mood-tracker');
      } else if (data?.type === 'mission_reminder' || data?.type === 'evening_reminder') {
        navigation.navigate('missions');
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(foregroundListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }
}

export default NotificationService;