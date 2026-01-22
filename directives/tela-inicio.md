# Diretriz: Tela de Início (Landing Page)

Esta diretiva detalha a implementação da primeira tela do aplicativo, baseada no mockup oficial.

## 1. Estrutura e Layout

### Topo (Header)
- **Branding**: Logo "Boituva" centralizado com o subtítulo "OUVIDORIA DIGITAL" em caixa alta, fonte menor e espaçada.
- **Saudação**: Texto "Olá! Como podemos ajudar hoje?" em destaque (Bold/Semi-bold), centralizado.

### Cards de Ação Principal (Grid Vertical)
Os cards devem ocupar a maior parte da largura central, com cantos arredondados (aprox. `24px`).

1. **Card 'Registrar'**:
    - **Fundo**: Azul Céu (Primário).
    - **Conteúdo (Esquerda)**: 
        - Título: "Registrar Nova Manifestação" (Branco, Bold, tamanho grande).
        - Subtítulo: "Faça elogios, sugestões ou denúncias" (Branco, opacidade levemente reduzida).
    - **Elemento (Direita)**: Ícone `+` branco dentro de um círculo com brilho suave. Fundo do ícone tem uma sobreposição geométrica sutil (estilo Material Design).

2. **Card 'Consultar'**:
    - **Fundo**: Grafite (Dark Grey).
    - **Conteúdo (Esquerda)**:
        - Título: "Consultar Manifestação" (Branco, Bold).
        - Subtítulo: "Acompanhe o status do seu pedido" (Cinza claro/Branco).
    - **Elemento (Direita)**: Ícone de lupa branca dentro de um círculo cinza escuro. Mesmo padrão geométrico sutil ao fundo.

### Widget de Sentimento (Bottom Section)
Um container branco (`Material Design Card`) com bordas arredondadas e sombra suave.

- **Título**: "Como você está se sentindo hoje?" (Centralizado).
- **Ícones de Feedback**: 4 círculos coloridos com emojis:
    1. **Feliz**: Fundo Verde Natureza (muito claro/transparente), Emoji Feliz.
    2. **Normal**: Fundo Azul Céu (muito claro/transparente), Emoji Neutro.
    3. **Chateado**: Fundo Amarelo Aventura (muito claro/transparente), Emoji Triste.
    4. **Bravo**: Fundo Vermelho/Ação (muito claro/transparente), Emoji Bravo.
- **Labels**: Texto abaixo de cada círculo (Feliz, Normal, Chateado, Bravo) em tom de Grafite suave.

## 2. Especificações Técnicas

- **Tipografia**: Poppins para todos os textos.
- **Background Geral**: Gradiente radial suave ou cinza ultra-claro (`#F8FAFC`).
- **Espaçamento**: Margens generosas entre os cards para facilitar o toque no Totem.
- **Micro-interações**: Ao tocar nos cards principais, aplicar um leve efeito de escala (`press-scale`) e mudança sutil de sombra.

## 3. Rodapé
- Texto discreto centralizado: "Toque em uma opção para começar • © 2026 Boituva".

---
**Próximo Passo**: Elaborar o plano de implementação (componentes e lógica) para esta tela.
