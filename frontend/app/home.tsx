import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const navigateToMoodTracker = () => {
    router.push('/mood-tracker');
  };

  const navigateToMissions = () => {
    router.push('/missions');
  };

  const navigateToProgress = () => {
    router.push('/progress');
  };

  const navigateToEmotionalProgress = () => {
    router.push('/emotional-progress');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Olá, {user?.name}!</Text>
          <Text style={styles.subtitleText}>Como você está se sentindo hoje?</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={navigateToProfile}
        >
          <Ionicons name="person-circle" size={32} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Subscription Status Card */}
      {subscriptionStatus && (
        <TouchableOpacity
          style={styles.subscriptionCard}
          onPress={() => router.push('/subscription')}
        >
          <LinearGradient
            colors={subscriptionStatus.is_trial ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
            style={styles.subscriptionGradient}
          >
            <View style={styles.subscriptionContent}>
              <View style={styles.subscriptionInfo}>
                <Ionicons 
                  name={subscriptionStatus.is_trial ? "time-outline" : "checkmark-circle-outline"} 
                  size={24} 
                  color="white" 
                />
                <View style={styles.subscriptionText}>
                  <Text style={styles.subscriptionTitle}>
                    {subscriptionStatus.is_trial ? 'Período Gratuito' : 'Assinatura Ativa'}
                  </Text>
                  <Text style={styles.subscriptionSubtitle}>
                    {subscriptionStatus.days_remaining} dias restantes
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToMoodTracker}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="happy" size={28} color="#4F46E5" />
              </View>
              <Text style={styles.actionTitle}>Registrar Humor</Text>
              <Text style={styles.actionSubtitle}>Como você se sente?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/chat')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8EAFF' }]}>
                <Ionicons name="chatbubbles" size={28} color="#6B73FF" />
              </View>
              <Text style={styles.actionTitle}>Chat Terapêutico</Text>
              <Text style={styles.actionSubtitle}>Converse com Dr. Ana</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToMissions}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="trophy" size={28} color="#F59E0B" />
              </View>
              <Text style={styles.actionTitle}>Missões Diárias</Text>
              <Text style={styles.actionSubtitle}>Ganhe ⭐ Estrelas cuidando de si</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={navigateToProgress}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="analytics" size={28} color="#3B82F6" />
              </View>
              <Text style={styles.actionTitle}>Meu Progresso</Text>
              <Text style={styles.actionSubtitle}>Veja suas ⭐ Estrelas e nível</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.secondaryActionsGrid}>
            <TouchableOpacity 
              style={styles.progressCard}
              onPress={navigateToEmotionalProgress}
            >
              <View style={styles.progressCardHeader}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="trending-up" size={28} color="#EF4444" />
                </View>
                <View style={styles.progressCardContent}>
                  <Text style={styles.actionTitle}>Progresso de Humor</Text>
                  <Text style={styles.actionSubtitle}>Veja seu histórico dos últimos 7 dias</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={24} color="#EF4444" />
            <Text style={styles.cardTitle}>Bem-vindo ao seu app de saúde mental</Text>
          </View>
          <Text style={styles.cardDescription}>
            Cuide da sua saúde mental todos os dias. Registre seu humor, complete missões 
            diárias e acompanhe seu progresso de autocuidado.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Funcionalidades disponíveis:</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="happy" size={20} color="#4F46E5" />
            <Text style={styles.featureText}>Registro de humor diário</Text>
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>✓</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="trophy" size={20} color="#F59E0B" />
            <Text style={styles.featureText}>Missões diárias com ⭐ Estrelas</Text>
            <View style={[styles.featureBadge, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.featureBadgeText}>✓</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={20} color="#3B82F6" />
            <Text style={styles.featureText}>Sistema de níveis e ⭐ Estrelas</Text>
            <View style={[styles.featureBadge, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.featureBadgeText}>✓</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="trending-up" size={20} color="#EF4444" />
            <Text style={styles.featureText}>Progresso emocional</Text>
            <View style={[styles.featureBadge, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.featureBadgeText}>✓</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="person-circle" size={20} color="#8B5CF6" />
            <Text style={styles.featureText}>Perfil personalizado</Text>
            <View style={[styles.featureBadge, { backgroundColor: '#8B5CF6' }]}>
              <Text style={styles.featureBadgeText}>✓</Text>
            </View>
          </View>
          
          <View style={[styles.featureItem, styles.featureItemDisabled]}>
            <Ionicons name="flower" size={20} color="#9CA3AF" />
            <Text style={[styles.featureText, styles.featureTextDisabled]}>
              Exercícios de meditação
            </Text>
          </View>
          
          <View style={[styles.featureItem, styles.featureItemDisabled]}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#9CA3AF" />
            <Text style={[styles.featureText, styles.featureTextDisabled]}>
              Chat de suporte emocional
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  secondaryActionsGrid: {
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  progressCardContent: {
    flex: 1,
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
    flex: 1,
  },
  cardDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureItemDisabled: {
    opacity: 0.5,
  },
  featureText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 12,
    flex: 1,
  },
  featureTextDisabled: {
    color: '#9CA3AF',
  },
  featureBadge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subscriptionCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  subscriptionGradient: {
    padding: 20,
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionText: {
    marginLeft: 12,
    flex: 1,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  subscriptionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});