# Documento de Casos de Testes - Velô Sprint

## Informações Gerais

- **Sistema:** Velô Sprint - Configurador de Veículo Elétrico
- **Perfil de Usuário:** Cliente (Usuário Comum)

---

### CT01 - Acesso à Landing Page e navegação para o Configurador

#### Objetivo

Validar o acesso correto à Landing Page do sistema e a capacidade de o usuário iniciar o fluxo através do redirecionamento para o Configurador de Veículo.

#### Pré-Condições

- O sistema deve estar em execução e acessível.
- Conexão de internet estável.

#### Passos

| Id  | Ação                                                  | Resultado Esperado                                                                         |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | Acessar a URL raiz do sistema (`/`)                   | A página inicial da Landing Page carrega completamente as informações sobre o Velô Sprint. |
| 2   | Clicar no botão "Configurar e Comprar" ou equivalente | O sistema redireciona o usuário para a página do Configurador (`/configure`).              |

#### Resultados Esperados

- O usuário é levado à rota do Configurador com o modelo ou imagens do carro e o painel de opções carregados.

#### Critérios de Aceitação

- A Landing page é renderizada sem erros no navegador.
- O botão de redirecionamento encaminha para a rota correta de modo imediato.

---

### CT02 - Seleção de atributos no Configurador de Veículos

#### Objetivo

Validar se as seleções de opções do carro (cor externa, interior e rodas) refletem corretamente na imagem exibida.

#### Pré-Condições

- O usuário deve estar na rota do configurador (`/configure`).

#### Passos

| Id  | Ação                                   | Resultado Esperado                                                                          |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Selecionar a Cor Externa "Lunar White" | A imagem do carro no palco principal é atualizada para a cor branca.                        |
| 2   | Selecionar as Rodas "Sport Wheels"     | A imagem do carro é atualizada mostrando as rodas Sport e o preço base altera em +R$ 2.000. |

#### Resultados Esperados

- A apresentação visual do carro e os preços dinâmicos devem ser atualizados instantaneamente após cada interação do usuário.

#### Critérios de Aceitação

- A cor externa altera a representação visual do veículo.
- A seleção da roda Sport reflete no incremento imediato do subtotal exibido (R$ 2.000).

---

### CT03 - Seleção de opcionais e validação do valor total

#### Objetivo

Validar que a adição de opcionais tecnológicos e de desempenho reflete no custo total seguindo as regras de negócio do Velô Sprint.

#### Pré-Condições

- O usuário deve estar na rota do configurador.

#### Passos

| Id  | Ação                                                                                      | Resultado Esperado                                                                                        |
| --- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | Adicionar o opcional "Precision Park"                                                     | O resumo da configuração incrementa o preço em +R$ 5.500 adicionados ao total corrente.                   |
| 2   | Adicionar o opcional "Flux Capacitor"                                                     | O resumo adiciona +R$ 5.000 ao preço total.                                                               |
| 3   | Clicar no botão para finalizar até a tela de Checkout ("Finalizar Pedido" ou equivalente) | O usuário é direcionado para a rota de Checkout/Pedido (`/order`) com o carrinho e a configuração salvos. |

#### Resultados Esperados

- O cálculo da soma final deve corresponder linearmente ao preço base do carro + valor das rodas (se diferente da base) + lista de opcionais.

#### Critérios de Aceitação

- O valor somado na tela corresponde de forma exata à regra de negócio estipulada.

---

### CT04 - Preenchimento do Checkout de Pedido (Pagamento À Vista) com sucesso

#### Objetivo

Validar o fluxo feliz de finalização e submissão do pedido utilizando a forma de pagamento selecionada como "À Vista".

#### Pré-Condições

- O usuário encontra-se na tela de Checkout (`/order`).
- Resumo do pedido já validado à direita da interface.

#### Passos

| Id  | Ação                                                        | Resultado Esperado                                                                                    |
| --- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Preencher corretamente os campos Nome, Sobrenome e e-mail   | Dados retidos no formulário sem mensagens de alerta inferior.                                         |
| 2   | Inserir de forma exata de um CPF e campo de Celular válidos | As máscaras garantem o preenchimento apropriado (Formato numérico com separadores).                   |
| 3   | Escolher uma loja listada em "Loja para Retirada"           | O item de select box retém o dado finalizado da rede filial de concessionárias.                       |
| 4   | Optar por método de pagamento "À Vista"                     | A caixa de pagamentos ressalta o método que pagará a quantia isenta de juros de modalidade crediário. |
| 5   | Marcar aceite em "Termos de Uso e Política de Privacidade"  | A checklist reage corretamente marcando permissão.                                                    |
| 6   | Executar o clique no confirmador ("Confirmar Pedido")       | O sistema finaliza a order e encaminha para a tela de Conclusão.                                      |

#### Resultados Esperados

- O pedido obtém o status gerado de "APROVADO", validando a compra bem-sucedida.

#### Critérios de Aceitação

- Será demonstrado o protocolo/número de pedido ao cliente na página confirmadora (`/success`).

---

### CT05 - Submissão e Validações no Formulário do Checkout

#### Objetivo

Garantir que submissões com dados inválidos ativem gatilhos contra criação de pedidos inconsistentes.

#### Pré-Condições

- Estar de posse do form da página de Checkout.

#### Passos

| Id  | Ação                                                                         | Resultado Esperado                                                                               |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | Deixar o formulário completamente em branco e clicar em "Confirmar Pedido"   | As regras exigem preenchimento. Mensagens como "Nome deve ter pelo menos 2 caracteres" aparecem. |
| 2   | Digitar e-mail em formato malformado (ex: `usuarionormal.domain`) e submeter | O gatilho reporá uma validação exibindo "Email inválido".                                        |
| 3   | Digitar CPF incompleto sob falha de limite de caracteres                     | Surge informe validante apontando para "CPF inválido".                                           |

#### Resultados Esperados

- As transações para o banco de dados via API são bloqueadas integralmente.

#### Critérios de Aceitação

- Ocorre inibição do processo sem redirecionamentos; é mandatório reescrever de acordo com o contrato esperado para que a página possua um fluxo efetivo.

---

### CT06 - Submissão do Pedido sem aceite aos Termos

#### Objetivo

Constatar o comportamento restritivo no caso da ausência jurídica da chancela ao Termo de Uso.

#### Pré-Condições

- Checklist do comprador vazia na respectiva propriedade dos termos obrigatórios sobre o aplicativo.

#### Passos

| Id  | Ação                                                    | Resultado Esperado                                                              |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Desmarcar e/ou evitar clique em "Li e aceito os Termos" | Check correspondente ausente.                                                   |
| 2   | Submeter ao clique geral em "Confirmar Pedido"          | Aciona mensagem "Aceite os termos" como obrigatoriedade imediata de progressão. |

#### Resultados Esperados

- Condição limitante do percurso da SPA. Interrompendo a criação até que ativada.

#### Critérios de Aceitação

- Formulário tem obrigação absoluta em ter o bit boolean para submissão setado como verdadeiro.

---

### CT07 - Análise de Crédito Automática (Score Alto - Aprovado)

#### Objetivo

Simular premissa onde há deferimento irrestrito ao usuário devido a score sadio na validação da tabela com sistema terceiro de financiamento.

#### Pré-Condições

- Submissão com todos campos corretos pelo frontend.
- Categoria de Pagamento alinhada em "Financiamento".
- Simulação cujo portador retornará Score > 700 da consulta remota do `credit-analysis`.

#### Passos

| Id  | Ação                                                                 | Resultado Esperado                                                                                |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Assinalar valor inferior a 50% de custo no campo Entrada             | As simulações das próximas 12x são apresentadas de forma correta e recálculo é feito com clareza. |
| 2   | Submeter "Confirmar Pedido"                                          | Loader exibe que consulta remota ocorre com as validações de Score.                               |
| 3   | Resposta base consumida e processamento redirecionado para Finalizar | Como o score era robusto (e.g. 850), o fluxo corre para TELA SUCESSO.                             |

#### Resultados Esperados

- A navegação reflete processamento feliz e aprovação unânime de forma síncrona/imediata.

#### Critérios de Aceitação

- Rota repassará nos parâmetros estritos da Order sua aceitação por "APROVADO".

---

### CT08 - Análise de Crédito Excepcional por Entrada Elevada (Sufocador de Score Baixo)

#### Objetivo

Exceção na aprovação: Confirmar subsídeo sistêmico que avaliza usuários com pontuação não propícia (<= 700) desde que garantam a margem de 50% de custeio por pagamento primário à vista.

#### Pré-Condições

- Perfil simulatório estritamente condicionado ao retorno de credor reprovado/manual (<700).

#### Passos

| Id  | Ação                                                                                          | Resultado Esperado                                                                                               |
| --- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Informar dentro de modelo Financiado sua quantia equivalente ou maior que 50% de `totalPrice` | Total remanescente diminui, logo demonstrativo de parcela adapta sua base ao que for restante (taxa de juro 2%). |
| 2   | Acionar processo via "Confirmar Pedido"                                                       | O sistema consagra a exceção matemática à regra de avaliação punitiva da consulta e destrava percurso.           |

#### Resultados Esperados

- Redirecionamento da URL acontece em modalidade contínua mesmo quando `credit-analysis < 700` no mock invocado.

#### Critérios de Aceitação

- O estado estrito computado tem garantia contratual firmada como "APROVADO" em resposta e view.

---

### CT09 - Análise de Crédito "Em Análise" (Score Mediano)

#### Objetivo

Identificar e rastrear aprovações inconclusas em faixa cinza de pontuação creditícia e de forma paralela validar que um operador manual verificaria posteriormente.

#### Pré-Condições

- Submissões corretas sob `Financiamento` com sinal abaixo de 50%.
- A API retorna à este cliente algo entre a faixa 501 e 700 para o CPF informado.

#### Passos

| Id  | Ação                                            | Resultado Esperado                         |
| --- | ----------------------------------------------- | ------------------------------------------ |
| 1   | Informar dados pessoais e de parcelamentos      | Sem gatilhos impeditórios visuais atuando. |
| 2   | Submeter avaliação executando clique em enviar. | Processamento do status.                   |

#### Resultados Esperados

- O pedido obtém um identificador e uma tratativa concluinte com reticência a sua homologação na montadora/sistema.

#### Critérios de Aceitação

- No relatório exibe explícito que se encontra repousado de forma "EM_ANALISE".

---

### CT10 - Análise de Crédito com Recusa Integral (Score Baixo)

#### Objetivo

Verificabilidade da tratativa em retornos de alto risco na plataforma.

#### Pré-Condições

- Entrada ínfima e repasse do integrador da API acusando pontuação nula, irrisória ou perigosa (abaixo de 500 cravados).

#### Passos

| Id  | Ação                                                                              | Resultado Esperado                                                             |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Inserir documentações em order para financiamento básico e submeter o confirmador | Início do cálculo avaliativo perante terceiros.                                |
| 2   | Obtenção dos resultados rechaçando aquisição                                      | É emitido o sinal de finalidade impedida para aquele trâmite formal de pedido. |

#### Resultados Esperados

- A aprovação esbarra irrevogavelmente nos termos de negócios da financiadora.

#### Critérios de Aceitação

- O rótulo "REPROVADO" é imposto sem concessões. Redirecionamento de Sucesso pode conter essa informação com um alerta adequado do status.

---

### CT11 - Cálculo da Parcela de Financiamento

#### Objetivo

Validar algebricamente exibição de custo aos clientes sob a taxa universal imposta internamente no fluxo Financiamento.

#### Pré-Condições

- Encontrar-se na tela Checkout `/order`.

#### Passos

| Id  | Ação                                                                                              | Resultado Esperado                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Clicar "Financiamento" sobre veículo montado na casa do Preço Base de `R$ 40.000` e Entrada vazia | Exposição que relata simulação exata a `12x R$ 3.400` de forma correspondente à fórmula de (`(40000/12)*1.02`).                                                                                             |
| 2   | Escrever como entrada do mesmo `R$ 10.000`                                                        | Recalibração instável para o repasse total para exibir o que equivalera como parcela ao montante residual. Restante de 30mil passará ao fator do divisor x juro final computável (Exibindo 12x R$ `2.550`). |

#### Resultados Esperados

- Não ocorrem desvios/equívocos de ponto flutuante Javascript na demonstração textual renderizada na tag dos itens para simular o 12 vezes acrescido da referida Taxação Mensal Exponencialmente fixada a base.

#### Critérios de Aceitação

- A matemática exposta exprime com total coerência lógica paramétrica da aplicação reativa daquele form no exato momento.

---

### CT12 - Redirecionamento da Confirmação de Sucesso

#### Objetivo

Acesso fluído do estado anterior gerador do preenchedor ativando a interface ressaltadora de finalizações após envio final.

#### Pré-Condições

- A transação inteira ocorreu com os envios preenchidos por via sícrona com a DB remota e recebendo as IDs em retorno de promessa.

#### Passos

| Id  | Ação                                                                       | Resultado Esperado            |
| --- | -------------------------------------------------------------------------- | ----------------------------- |
| 1   | O serviço despacha um `navigate/history push` encaminhando payload gerado. | Rota `/success` atua ativada. |

#### Resultados Esperados

- O layout carrega felicitando e englobando os sumários essenciais como os identificadores da própria compra realizada.

#### Critérios de Aceitação

- Não pode faltar acesso/visibilidade por menor que seja, ao string do Número de Pedido único.

---

### CT13 - Consulta de Pedidos Ativos pelo Cliente (Fluxo Feliz)

#### Objetivo

Possibilitar acesso post-consumo via campo de segurança utilizando Order Identifier exato.

#### Pré-Condições

- Dispor do Tracker de Referência ou Número do Pedido anotado previamente pelo cliente.
- Encontrar-se nativamente inserido em contexto da Busca de Pedidos (`/consulta`).

#### Passos

| Id  | Ação                                                               | Resultado Esperado                                                                                                                                                                                                    |
| --- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Anexar ao input de busca string válida respectiva do pedido gerado | Espaço captura e viabiliza a execução do request.                                                                                                                                                                     |
| 2   | Trigar "Buscar Pedido"                                             | Aciona loader.                                                                                                                                                                                                        |
| 3   | Encontrar Match do registro                                        | Card exibe de forma harmoniosa os campos: Identificador, Imagem e Componentes Adicionados para verificação dos dados (veículos e montantes). E também ressalta o estado atrelado (APROVADO, EM_ANÁLISE ou REPROVADO). |

#### Resultados Esperados

- Card desenha unicamente contexto atrelado diretamente entre aquele `ID` preenchível e os do backoffice. Evitando que não seja visualizado caso de sucesso de outros.

#### Critérios de Aceitação

- Confirma que nenhum dado restritivo da rede paralela se sobreponha à verificação por causa da exigência única do Order Tracker.

---

### CT14 - Consulta de Pedidos Omissos / Inválidos

#### Objetivo

Atestar impeditivo quando cliente anexa números irreais por esquecimento, fraudes randômicas ou descontinuados na rede da Query.

#### Pré-Condições

- Busca na tela inicial de pedidos. Cliente tentando ID fantasma.

#### Passos

| Id  | Ação                                                                   | Resultado Esperado                                                 |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | Introduzir na pesquisa dados errôneos/não pareados (e.g., `0000123xx`) | Inserção tolerável sintaxicamente por input de pesquisa.           |
| 2   | Confirmar busca                                                        | Acesso recusa devolução de Objeto para extração de Payload da API. |

#### Resultados Esperados

- Exibição condizente do componente de "Pedido não encontrado / Verifique os dados digitados" como Fallback para a injeção que não teve retorno compatível na listagem de dados.

#### Critérios de Aceitação

- Erros 404/400 são capturados e o React repassa mensagem contextual avisória ao invés de quebrar renderização e provocar white screen descompassado para o Usuário Comum.
