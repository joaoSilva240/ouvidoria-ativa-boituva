# Execução: Tela de Início (Landing Page)

Este documento descreve os passos técnicos para implementar a primeira tela do aplicativo.

## 1. Criação de Componentes Base

- [ ] `src/components/ActionCard.tsx`: Card grande com ícone lateral e efeitos de toque.
- [ ] `src/components/SentimentWidget.tsx`: Container inferior para feedback emocional.
- [ ] `src/components/Header.tsx`: Logo Boituva e saudação centralizada.

## 2. Detalhes de Estilização (Tailwind)

- **Cards**: Usar `rounded-[32px]` para bordas bem arredondadas, sombras `shadow-xl` e `framer-motion` para animação `whileTap={{ scale: 0.98 }}`.
- **Background**: Aplicar um gradiente radial suave: `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100`.
- **Tipografia**: Utilizar `font-poppins` em todos os elementos.

## 3. Montagem da Página

- [ ] Integrar os componentes no `src/app/page.tsx`.
- [ ] Garantir o alinhamento centralizado e o espaçamento proporcional à imagem de referência.

---
**Status**: Em desenvolvimento.
