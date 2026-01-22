# Execução: Configuração de Ambiente

Este processo descreve a inicialização técnica do projeto no diretório `c:\Dev\ouvidoria-btv`.

## 1. Instalação de Ferramentas (Stack Front-end)

O projeto será baseado em **Next.js** com **TypeScript** e **Tailwind CSS**, conforme aprovado.

### Comandos de Inicialização
1. **Instalação Base**:
   ```bash
   npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git
   ```
2. **Dependências de Design (Premium UI)**:
   - `lucide-react`: Para os ícones oficiais.
   - `framer-motion`: Para as animações de toque e transições entre telas.
   - `clsx` e `tailwind-merge`: Para gestão dinâmica de classes CSS.
   - `shadcn/ui`: Inicialização do kit de componentes base.

## 2. Limpeza de Boilerplate

Após a instalação, os seguintes arquivos/pastas devem ser limpos para remover o estilo padrão do Next.js:
- [ ] Remover `src/app/globals.css` (manter apenas as diretivas Tailwind).
- [ ] Limpar `src/app/page.tsx` para um componente vazio.
- [ ] Deletar imagens e ícones padrão da pasta `public/`.
- [ ] Ajustar `tailwind.config.ts` para incluir as cores do **Boituva Material Design**.

## 3. Preparação para as Telas

Com o ambiente limpo, seguiremos a ordem:
1. Configuração do `tailwind.config.ts` com o **Design System**.
2. Criação do layout base (`src/app/layout.tsx`) com a fonte **Poppins**.
3. Implementação da **Tela de Início** como primeira execução de UI.

---
**Próximo Passo**: Executar a instalação assim que houver sinal verde.
