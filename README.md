# 💙 Humor Diário - App de Saúde Mental

Aplicativo completo de saúde mental e acompanhamento de humor diário desenvolvido em React Native com Expo.

## 🎯 Funcionalidades Principais

### 1. **Sistema de Autenticação**
- ✅ Registro de usuários com validação
- ✅ Login seguro com JWT
- ✅ Perfil personalizável com foto (base64)
- ✅ Persistência de sessão

### 2. **Registro de Humor Diário**
- ✅ Escala de 1-5 com emojis (😢 😞 😐 😊 😄)
- ✅ Descrição opcional do dia
- ✅ Atualização do humor do dia
- ✅ Histórico completo de humor

### 3. **Sistema de Missões Gamificadas**
- ✅ **8 categorias** de missões:
  - 🧘 Mindfulness & Meditação
  - 💖 Gratidão & Positividade
  - 🏃 Movimento & Energia
  - 👥 Conexão Social
  - 🛁 Autocuidado
  - 🎨 Criatividade & Expressão
  - 🌱 Natureza & Ambiente
  - 📚 Aprendizado & Crescimento
- ✅ **32 missões únicas** selecionadas dinamicamente
- ✅ 5 missões diárias personalizadas por nível
- ✅ Sistema de XP e níveis (100 XP por nível)
- ✅ Dificuldade: Fácil, Média, Difícil

### 4. **Chat Terapêutico com IA**
- ✅ Dr. Ana - Terapeuta virtual usando **Gemini 2.0 Flash**
- ✅ Respostas personalizadas baseadas no contexto do usuário
- ✅ Integração com humor recente e missões
- ✅ Conversas salvas com histórico
- ✅ Múltiplas conversas suportadas

### 5. **Progresso Emocional**
- ✅ Gráficos de humor semanal
- ✅ Visualização de tendências
- ✅ Estatísticas de humor
- ✅ Histórico completo

### 6. **Sistema de Progresso e XP**
- ✅ Níveis e experiência (XP)
- ✅ Barra de progresso visual
- ✅ Estatísticas de missões completadas
- ✅ XP ganho hoje

### 7. **Notificações**
- ✅ Lembretes diários para registrar humor
- ✅ Notificações personalizáveis
- ✅ Sistema habilitado/desabilitado por usuário

### 8. **Sistema de Assinatura (Removido)**
- ✅ **TODOS os recursos disponíveis sem bloqueios**
- ✅ Sem período de trial
- ✅ Acesso completo ao aplicativo

## 🛠️ Stack Tecnológica

### Frontend
- **React Native** 0.79.5
- **Expo** 54.x (com Router)
- **TypeScript**
- **Axios** para chamadas API
- **AsyncStorage** para persistência local
- **Expo Vector Icons**
- **Expo Linear Gradient**
- **Expo Image Picker**
- **Expo Notifications**
- **React Native SVG** para gráficos

### Backend
- **FastAPI** 0.110.1
- **Python** 3.x
- **MongoDB** com Motor (async)
- **JWT** para autenticação
- **BCrypt** para hash de senhas
- **Emergent Integrations** para LLM
- **Gemini 2.0 Flash** (via Emergent LLM Key)

## 📱 Estrutura do App

```
frontend/
├── app/
│   ├── index.tsx              # Tela inicial (loading/redirect)
│   ├── welcome.tsx            # Tela de boas-vindas
│   ├── login.tsx              # Tela de login
│   ├── register.tsx           # Tela de registro
│   ├── home.tsx               # Dashboard principal
│   ├── mood-tracker.tsx       # Registro de humor
│   ├── missions.tsx           # Missões diárias
│   ├── progress.tsx           # Progresso e XP
│   ├── emotional-progress.tsx # Histórico de humor
│   ├── profile.tsx            # Perfil do usuário
│   ├── chat.tsx               # Chat com Dr. Ana
│   └── _layout.tsx            # Layout e providers
├── contexts/
│   ├── AuthContext.tsx        # Contexto de autenticação
│   └── SubscriptionContext.tsx# Contexto simplificado (sem bloqueios)
├── components/
│   └── SubscriptionGuard.tsx  # Pass-through component
└── services/
    └── NotificationService.tsx# Serviço de notificações

backend/
├── server.py                  # API principal
├── models/
│   ├── missions.py           # Modelos de missões
│   └── chat.py               # Modelos de chat
└── .env                      # Configurações (EMERGENT_LLM_KEY)
```

## 🚀 Como Usar

### 1. Backend
O backend já está configurado e rodando em `http://localhost:8001`

### 2. Frontend
O frontend já está configurado e acessível via preview do Emergent

### 3. Criar Conta
1. Abra o app no preview
2. Clique em "Criar conta"
3. Preencha: nome, email e senha
4. Pronto! Você terá acesso completo

### 4. Funcionalidades
- **Registrar Humor**: Clique em "Registrar Humor" no home
- **Missões**: Veja suas 5 missões diárias e complete-as para ganhar XP
- **Chat**: Converse com a Dr. Ana sobre seus sentimentos
- **Progresso**: Acompanhe seu nível, XP e histórico emocional

## 🔑 Variáveis de Ambiente

### Backend (.env)
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
JWT_SECRET_KEY="humor-diario-secret-key-2025"
EMERGENT_LLM_KEY="sk-emergent-55869Ff778123962f1"
STRIPE_API_KEY="sk_test_dummy_key"
```

### Frontend (.env)
```
EXPO_PACKAGER_PROXY_URL=...
EXPO_PACKAGER_HOSTNAME=...
EXPO_PUBLIC_BACKEND_URL=...
```

## 📊 Banco de Dados (MongoDB)

### Coleções
- `users` - Usuários do sistema
- `humor_diario` - Registros de humor
- `missions` - Banco de missões disponíveis
- `daily_mission_sets` - Conjuntos de missões diárias por usuário
- `user_mission_progress` - Progresso de missões
- `user_stats` - Estatísticas de XP e nível
- `chat_conversations` - Conversas com Dr. Ana
- `chat_messages` - Mensagens individuais
- `subscription_plans` - Planos (informativo apenas)
- `user_subscriptions` - Assinaturas (todos têm acesso completo)

## 🎨 Design

- **Cores principais**: 
  - Primária: #4F46E5 (Indigo)
  - Secundária: #8B5CF6 (Roxo)
  - Background: #F8FAFC
  - Texto: #1E293B

- **Design System**:
  - Cards com sombras suaves
  - Bordas arredondadas (12-16px)
  - Ícones do Ionicons
  - Gradientes para destaques

## 🧪 Testado

✅ Registro e login de usuários  
✅ Registro de humor diário  
✅ Missões dinâmicas por dia  
✅ Completar missões e ganhar XP  
✅ Chat com Dr. Ana (Gemini)  
✅ Progresso e níveis  
✅ Histórico emocional  
✅ Perfil com foto  

## 📝 Notas

- **Sem bloqueios de assinatura**: Todos os recursos estão disponíveis
- **Chat IA**: Usa Emergent LLM Key para Gemini 2.0 Flash
- **Missões dinâmicas**: 5 novas missões por dia, selecionadas por categoria e nível
- **Gamificação**: Sistema de XP e níveis para engajamento
- **Privacidade**: Dados armazenados localmente e no MongoDB

## 🎉 Pronto para Uso!

O aplicativo está completo e funcional. Todas as funcionalidades principais foram implementadas e testadas.

**Preview URL**: Disponível através do Emergent  
**Backend API**: http://localhost:8001/api  
**Documentação API**: http://localhost:8001/docs
