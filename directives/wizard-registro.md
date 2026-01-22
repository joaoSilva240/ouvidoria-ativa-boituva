# Diretriz: Wizard de Registro (Fluxo Multi-etapas)

O cerne do aplicativo. Deve guiar o cidadão sem sobrecarregá-lo com muitas informações de uma vez.

### Componentes Comuns do Wizard (Header & Progress)
- **Header**: Logo Boituva à esquerda e um botão "Voltar" (Outlined, estilo Grafite) com ícone de seta à direita.
- **Stepper (Barra de Progresso)**: 4 círculos numerados. O círculo ativo é Azul Céu com número branco, e possui uma barra azul logo abaixo com o nome da etapa (ex: "Identificação"). Etapas futuras são cinza claro.

### Passo 1: Identificação (UI Specification)

#### Seleção de Modo (Cards)
- **Grid**: Duas colunas lado a lado.
- **Card Ativo (Identificado na imagem)**: Borda grossa Azul Céu, ícone de usuário em círculo azul translúcido, texto "Identificado" em negrito.
- **Card Inativo (Anônimo na imagem)**: Sem borda colorida, ícone de "olho oculto" em círculo cinza, texto "Anônimo" em negrito.

#### Formulário de Dados
Alojado dentro de um `Material Design Card` branco.
- **Campo 'Nome Completo'**:
    - Label simples acima do input.
    - Input com ícone de usuário interno à esquerda.
    - Borda de foco em Azul Céu para indicar entrada ativa.
- **Campo 'E-mail ou Telefone'**:
    - Input com ícone de envelope/contato.
    - Fundo cinza suave (`bg-slate-50`) quando não focado.
- **Botão 'Continuar'**:
    - Estilo Sólido Azul Céu, largura total do card, com ícone de seta para a direita.

#### Lógica de Comportamento
- Ao selecionar "Anônimo", os campos do formulário devem ser desabilitados ou ocultados (dependendo da regra de negócio), e o botão "Continuar" permanece ativo apenas para prosseguir sem dados.
- O botão "Voltar" no header retorna para a Tela de Início.

### Passo 2: Categoria (UI Specification)

#### Título e Instrução
- **Título**: "O que você deseja registrar?" (Bold, centralizado).
- **Subtítulo**: "Toque em uma das opções abaixo para continuar." (Grafite suave).

#### Grid de Categorias
- **Layout**: Grid responsivo (na imagem, 3 colunas na primeira linha, 2 na segunda).
- **Componente 'CategoryCard'**:
    - Fundo branco, cantos arredondados, sombra leve.
    - **Ícone**: Centralizado dentro de um círculo com cor de fundo translúcida (seguindo o Boituva UI Kit).
    - **Categorias (Ícone + Cor)**:
        1. **Elogio**: Ícone Joinha (Verde Natureza).
        2. **Sugestão**: Ícone Lâmpada (Amarelo Aventura).
        3. **Reclamação**: Ícone Megafone (Laranja/Atenção).
        4. **Denúncia**: Ícone Martelo/Justiça (Grafite).
        5. **Informação**: Ícone "i" (Azul Céu).

#### Lógica de Comportamento
- **Seleção Única**: Apenas uma categoria pode ser selecionada por vez.
- **Feedback**: O card selecionado deve receber uma borda ou destaque visual (similar aos cards de identificação).
- **Botão Continuar**: Habilitado apenas após a seleção de uma categoria.
- **Progressão**: O Stepper agora marca o passo 2 ("Categoria") como ativo e o passo 1 ("Identificação") como concluído.

### Passo 3: Detalhes (Relato)

#### Título e Instrução
- **Título**: "O que aconteceu?" (Bold, centralizado).
- **Subtitulo**: "Toque na área abaixo para descrever sua manifestação. Seja detalhado para nos ajudar a resolver o problema."

#### Área de Texto (Input Area)
- **Componente**: Um grande `Material Design Card` branco que funciona como área de toque.
- **Placeholder Central**: 
    - Ícone de "Toque" (mão).
    - Texto: "Toque aqui para digitar" (Azul Céu).
- **Aviso de Teclado**: Uma cápsula (pill) Azul Céu translúcido no rodapé com a mensagem: "O teclado virtual aparecerá ao tocar na área de texto." e um ícone de informação.
- **Micro-interação**: Ao tocar, o placeholder some e o cursor de texto aparece. Na implementação real, isso deve disparar o teclado virtual do Totem.

#### Progressão
- **Stepper**: Passos 1 e 2 marcados com check (círculos preenchidos). Passo 3 destacado com aura azul e label "Detalhes".

### Passo 4: Finalização (Resumo)

#### Cabeçalho Adicional
- **Botão Superior Direito**: "Minhas Manifestações" (Azul Céu, estilo pill/arredondado).

#### Título e Subtítulo
- **Título**: "Resumo e Finalização"
- **Subtítulo**: "Confira os dados abaixo antes de confirmar o envio da sua manifestação."

#### Card de Resumo (Summary Card)
- **Estrutura**: Container branco com borda e sombra.
- **Seções Internas (Grid 2x2)**:
    - **Identificação**: Nome e CPF/Documento com ícone de usuário.
    - **Tipo**: Categoria selecionada exibida como uma **tag/badge** levemente colorida.
    - **Departamento**: Setor responsável com ícone de prédio.
    - **Local**: Endereço completo com ícone de pin.
- **Área do Relato**: Box cinza claro (`bg-slate-50`) exibindo o texto completo da manifestação.
- **Anexos**: Menção aos arquivos anexados com ícone de clipe de papel.

#### Consentimento e Envio
- **Checkbox de Declaração**: Localizado em um box azul ultra-claro. Texto legal sobre veracidade das informações.
- **Botão Master**: "ENVIAR MANIFESTAÇÃO" (Azul Céu, Extra Large) com ícone de avião de papel.

#### Rodapé Institucional (Footer)
- Layout em 3 colunas:
    1. **Prefeitura de Boituva**: Logo e slogan.
    2. **Contato**: Telefone, E-mail e Endereço físico.
    3. **Links Rápidos**: Lista de links para Transparência, Diário Oficial, etc.
- **Copyright**: 2026 Prefeitura Municipal de Boituva.

## 2. Regras de UX
- **Botão "Voltar"**: Sempre presente no canto inferior esquerdo para corrigir erros.
- **Salva Automática**: O progresso é mantido se houver uma breve inatividade (com aviso).
- **Validação**: Impedir avanço se campos obrigatórios (como descrição) estiverem vazios.

---
**Próximo Passo**: Mockup do Passo 2 (Categorias).
