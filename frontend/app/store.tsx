import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Ebook {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  pages: number;
  rating: number;
  reviews: number;
  bestseller?: boolean;
  new?: boolean;
  preview?: string;
}

const ebooks: Ebook[] = [
  {
    id: 'mindfulness',
    title: 'Mindfulness e Bem-Estar Mental',
    description: 'Um guia completo para desenvolver mindfulness e alcançar equilíbrio emocional no dia a dia.',
    price: 29.90,
    originalPrice: 49.90,
    category: 'Saúde Mental',
    pages: 120,
    rating: 4.8,
    reviews: 142,
    bestseller: true,
    preview: '/assets/ebook-mindfulness-preview.pdf'
  },
  {
    id: 'breathing',
    title: 'Técnicas de Respiração para Ansiedade',
    description: 'Aprenda métodos cientificamente comprovados para controlar a ansiedade através da respiração.',
    price: 19.90,
    category: 'Ansiedade',
    pages: 85,
    rating: 4.9,
    reviews: 89,
    new: true,
    preview: '/assets/ebook-respiracao-preview.pdf'
  },
  {
    id: 'gratitude',
    title: 'Diário da Gratidão: 30 Dias de Transformação',
    description: 'Transforme sua perspectiva de vida com exercícios práticos de gratidão e reflexão.',
    price: 24.90,
    originalPrice: 39.90,
    category: 'Desenvolvimento Pessoal',
    pages: 95,
    rating: 4.7,
    reviews: 67,
    preview: '/assets/ebook-gratidao-preview.pdf'
  },
  {
    id: 'stress',
    title: 'Gestão do Estresse no Trabalho',
    description: 'Estratégias práticas para lidar com pressões profissionais e manter o equilíbrio.',
    price: 34.90,
    category: 'Vida Profissional',
    pages: 156,
    rating: 4.6,
    reviews: 23,
    preview: '/assets/ebook-estresse-preview.pdf'
  }
];

export default function StoreScreen() {
  const router = useRouter();
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handlePurchase = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedEbook) return;
    
    Alert.alert(
      'Compra Realizada! 🎉',
      `Parabéns! Você adquiriu "${selectedEbook.title}". O ebook foi adicionado à sua biblioteca e você receberá um email com o link para download.`,
      [
        {
          text: 'Ver na Biblioteca',
          onPress: () => {
            setShowPurchaseModal(false);
            router.push('/library');
          }
        },
        {
          text: 'Continuar Comprando',
          onPress: () => setShowPurchaseModal(false)
        }
      ]
    );
  };

  const openPreview = (ebook: Ebook) => {
    if (ebook.preview) {
      Alert.alert(
        'Preview do Ebook',
        'Em um app real, aqui abriria o PDF de preview. Por enquanto, simulando visualização...',
        [{ text: 'OK' }]
      );
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Saúde Mental': '#4F46E5',
      'Ansiedade': '#22C55E',
      'Desenvolvimento Pessoal': '#F59E0B',
      'Vida Profissional': '#EF4444'
    };
    return colors[category] || '#64748B';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#F59E0B" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#F59E0B" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#D1D5DB" />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loja de Ebooks</Text>
        <TouchableOpacity onPress={() => router.push('/library')}>
          <Ionicons name="library" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.heroSection}
        >
          <Text style={styles.heroTitle}>Transforme sua vida com conhecimento</Text>
          <Text style={styles.heroSubtitle}>
            Ebooks exclusivos sobre saúde mental, bem-estar e desenvolvimento pessoal
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Leitores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8★</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Satisfação</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias Populares</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {['Saúde Mental', 'Ansiedade', 'Desenvolvimento Pessoal', 'Vida Profissional'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryChip, { borderColor: getCategoryColor(category) }]}
                >
                  <Text style={[styles.categoryText, { color: getCategoryColor(category) }]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Ebooks Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Ebooks</Text>
          
          {ebooks.map((ebook) => (
            <View key={ebook.id} style={styles.ebookCard}>
              {/* Badges */}
              <View style={styles.badgeContainer}>
                {ebook.bestseller && (
                  <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
                    <Text style={styles.badgeText}>Bestseller</Text>
                  </View>
                )}
                {ebook.new && (
                  <View style={[styles.badge, { backgroundColor: '#22C55E' }]}>
                    <Text style={styles.badgeText}>Novo</Text>
                  </View>
                )}
              </View>

              <View style={styles.ebookContent}>
                <View style={styles.ebookHeader}>
                  <View style={styles.ebookInfo}>
                    <Text style={styles.ebookTitle}>{ebook.title}</Text>
                    <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(ebook.category) + '20' }]}>
                      <Text style={[styles.categoryTagText, { color: getCategoryColor(ebook.category) }]}>
                        {ebook.category}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    {ebook.originalPrice && (
                      <Text style={styles.originalPrice}>R$ {ebook.originalPrice.toFixed(2)}</Text>
                    )}
                    <Text style={styles.price}>R$ {ebook.price.toFixed(2)}</Text>
                  </View>
                </View>

                <Text style={styles.ebookDescription}>{ebook.description}</Text>

                <View style={styles.ebookMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="document-text" size={16} color="#64748B" />
                    <Text style={styles.metaText}>{ebook.pages} páginas</Text>
                  </View>
                  
                  <View style={styles.ratingContainer}>
                    <View style={styles.stars}>
                      {renderStars(ebook.rating)}
                    </View>
                    <Text style={styles.ratingText}>
                      {ebook.rating} ({ebook.reviews} avaliações)
                    </Text>
                  </View>
                </View>

                <View style={styles.ebookActions}>
                  {ebook.preview && (
                    <TouchableOpacity
                      style={styles.previewButton}
                      onPress={() => openPreview(ebook)}
                    >
                      <Ionicons name="eye" size={18} color="#4F46E5" />
                      <Text style={styles.previewText}>Preview</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handlePurchase(ebook)}
                  >
                    <Ionicons name="card" size={18} color="#FFFFFF" />
                    <Text style={styles.buyText}>Comprar Agora</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <View style={styles.supportCard}>
            <Ionicons name="help-circle" size={32} color="#4F46E5" />
            <Text style={styles.supportTitle}>Precisa de Ajuda?</Text>
            <Text style={styles.supportText}>
              Entre em contato conosco se tiver dúvidas sobre os ebooks ou problemas com sua compra.
            </Text>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>Falar com Suporte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="card" size={48} color="#4F46E5" />
              <Text style={styles.modalTitle}>Confirmar Compra</Text>
            </View>

            {selectedEbook && (
              <>
                <Text style={styles.modalEbookTitle}>{selectedEbook.title}</Text>
                <Text style={styles.modalPrice}>R$ {selectedEbook.price.toFixed(2)}</Text>
                
                <View style={styles.paymentMethods}>
                  <Text style={styles.paymentTitle}>Métodos de Pagamento:</Text>
                  <View style={styles.paymentOptions}>
                    <TouchableOpacity style={styles.paymentOption}>
                      <Ionicons name="card" size={20} color="#4F46E5" />
                      <Text style={styles.paymentText}>Cartão de Crédito</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.paymentOption}>
                      <Ionicons name="logo-paypal" size={20} color="#4F46E5" />
                      <Text style={styles.paymentText}>PayPal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.paymentOption}>
                      <Ionicons name="qr-code" size={20} color="#4F46E5" />
                      <Text style={styles.paymentText}>PIX</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowPurchaseModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={confirmPurchase}
              >
                <Text style={styles.modalButtonPrimaryText}>Confirmar Compra</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    margin: 20,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E8EAFF',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#E8EAFF',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ebookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ebookContent: {
    padding: 20,
  },
  ebookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ebookInfo: {
    flex: 1,
    marginRight: 16,
  },
  ebookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22C55E',
  },
  ebookDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  ebookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748B',
  },
  ebookActions: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  buyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    gap: 6,
  },
  buyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  supportSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 12,
  },
  modalEbookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
    textAlign: 'center',
    marginBottom: 24,
  },
  paymentMethods: {
    marginBottom: 32,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  paymentOptions: {
    gap: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});