# Página Corporativa - MindCare Pro

## 📄 Descrição

Página web independente para vendas B2B de licenças corporativas do aplicativo de saúde mental. Esta página é **totalmente separada** do app React Native e consome a mesma API backend.

## 🚀 Funcionalidades

### ✨ **Landing Page Profissional**
- Hero section com estatísticas impactantes
- Seção de benefícios corporativos
- Calculadora de investimento em tempo real
- Três planos de pricing (Starter, Business, Enterprise)
- Formulário de solicitação de orçamento
- Design responsivo para mobile e desktop

### 💰 **Sistema de Preços**
- **STARTER**: R$ 15/funcionário/mês (até 50 funcionários)
- **BUSINESS**: R$ 12/funcionário/mês (até 200 funcionários) 
- **ENTERPRISE**: R$ 8/funcionário/mês (201+ funcionários)
- Desconto de 20% para pagamento anual

### 📊 **Calculadora Inteligente**
- Recomendação automática de plano baseada no número de funcionários
- Cálculo em tempo real de valores mensais e anuais
- Interface intuitiva e responsiva

### 📨 **Sistema de Leads**
- Formulário completo para captura de leads corporativos
- Validação de campos em tempo real
- Integração com API backend para armazenamento
- Modal de sucesso com próximos passos

## 🛠️ Configuração

### **Arquivos Principais:**
```
/app/corporate-website/
├── index.html      # Página principal
├── styles.css      # Estilos CSS
├── script.js       # JavaScript funcional
└── README.md       # Documentação
```

### **Configuração da API:**
No arquivo `script.js`, altere a URL da API conforme necessário:
```javascript
const API_BASE_URL = 'http://localhost:8001/api'; // Ajuste conforme ambiente
```

## 📡 Integração com Backend

### **Endpoints Utilizados:**
- `POST /api/corporate/quote` - Criar solicitação de orçamento
- `GET /api/corporate/quotes` - Listar orçamentos (admin)

### **Estrutura dos Dados:**
```json
{
  "company": "Nome da Empresa",
  "name": "Nome do Contato", 
  "email": "email@empresa.com",
  "phone": "(11) 99999-9999",
  "employees": 100,
  "message": "Mensagem opcional",
  "selectedPlan": "BUSINESS",
  "source": "corporate_website"
}
```

## 🌐 Como Usar

### **1. Hospedagem Local:**
```bash
# Navegue até o diretório
cd /app/corporate-website

# Sirva os arquivos (exemplo com Python)
python -m http.server 8080

# Acesse: http://localhost:8080
```

### **2. Hospedagem Web:**
- Faça upload dos arquivos para qualquer servidor web
- Certifique-se de que o backend está acessível
- Ajuste `API_BASE_URL` no script.js conforme necessário

### **3. Deploy em CDN:**
- Suporta deployment direto em Netlify, Vercel, GitHub Pages
- Não requer servidor backend para servir arquivos estáticos
- Apenas consome a API existing do backend

## 📱 Recursos Mobile

### **Design Responsivo:**
- Otimizado para dispositivos móveis
- Breakpoints: 768px (tablet) e 480px (mobile)
- Touch-friendly com botões de tamanho adequado
- Formulários adaptados para telas pequenas

### **Performance:**
- CSS otimizado com grid e flexbox
- JavaScript vanilla (sem dependências)
- Lazy loading para imagens
- Animações CSS suaves

## 🔧 Customização

### **Branding:**
- Logo: Altere `💚 MindCare Pro` no header
- Cores: Modifique variáveis CSS em `styles.css`
- Conteúdo: Edite textos diretamente no `index.html`

### **Preços:**
Os preços são definidos no `script.js`:
```javascript
const pricingPlans = {
    starter: { pricePerEmployee: 15, maxEmployees: 50 },
    business: { pricePerEmployee: 12, maxEmployees: 200 },
    enterprise: { pricePerEmployee: 8, maxEmployees: 999999 }
};
```

### **Funcionalidades:**
- Adicione novos campos no formulário editando `index.html`
- Personalize validações no `script.js`
- Implemente tracking de analytics (GTM, Facebook Pixel)

## 📊 Analytics e Tracking

### **Eventos Rastreados:**
- Uso da calculadora
- Seleção de planos
- Abertura de modais
- Submissão de formulários
- Conversões

### **Integração:**
```javascript
// Google Analytics 4
gtag('event', 'conversion', {
    'send_to': 'AW-CONVERSION_ID',
    'value': calculatedPrice,
    'currency': 'BRL'
});

// Facebook Pixel  
fbq('track', 'Lead', {
    'value': calculatedPrice,
    'currency': 'BRL'
});
```

## 🚀 SEO e Performance

### **Otimizações Incluídas:**
- Meta tags semânticas
- Estrutura HTML5 adequada
- CSS minificado e otimizado
- JavaScript com lazy loading
- Imagens responsivas (quando aplicável)

### **Melhorias Sugeridas:**
- Adicionar meta description personalizada
- Implementar schema markup para empresas
- Configurar Google Search Console
- Adicionar sitemap.xml

## 🔒 Segurança

### **Validações:**
- Validação client-side de formulários
- Sanitização de inputs
- Rate limiting no backend
- Proteção contra CSRF

### **CORS:**
Certifique-se de que o backend permite requisições da origem da página:
```python
# No FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seudominio.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 📞 Suporte

Para dúvidas ou customizações:
- 📧 Email: suporte@mindcarepro.com  
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Site: https://mindcarepro.com

---

**Desenvolvido para gerar leads qualificados e impulsionar vendas B2B! 🚀**