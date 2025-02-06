# Documentação da Integração Trello → BMC ITSM

## 1. Visão Geral

Esta documentação descreve o fluxo de integração entre o Trello e o SDM(BMC ITSM), permitindo a criação e atualização automática de tickets no SDM com base em informações e movimentações dos cards do Trello.

A integração entre Trello e BMC ITSM tem como objetivo automatizar a criação e atualização de tickets no SDM a partir de informações de cards no Trello. Quando um card é criado ou arrastado em um board específico, um serviço de integração (desenvolvido em Node.js/NestJS) captura os dados relevantes, como título, descrição, prioridade e responsável. Esses dados são processados e enviados para a API do SDM, onde um novo ticket de incidente e requisição é gerado automaticamente e de acordo com a coluna que ele estiver o seu status será atualizao.

## 2. Arquitetura da Solução

A integração entre o **Trello** e o **BMC ITSM (SDM)** segue um fluxo estruturado para garantir a criação automática de tickets no ITSM sempre que um card for adicionado a uma coluna monitorada no Trello. A arquitetura da solução é composta por três camadas principais:

![Image](https://github.com/user-attachments/assets/90fdda08-e053-4aed-9194-8de1af41f57c)

A solução envolve três elementos principais:

1. **Trello**:
   - O usuário move um card a uma **coluna X**, que é previamente configurada para ser monitorada.
   - Quando isso ocorre, um **webhook** do Trello dispara uma mensagem para o serviço de integração.
2. **Serviço de Integração**:
   - Processa as informações do card recebido no webhook.
   - Verifica se o card contém **Nome de requisitante válido, Título** para categorização.
   - Se houver as informações necessárias, o serviço verifica qual a ação que devera ser realizada **Criação ou atualização** e constrói um **JSON de requisição do ticket** no formato esperado pelo SDM.
   - Envia o JSON para o endpoint específico da API do SDM de acordo com ação que será realizada.
3. **BMC ITSM (SDM)**:
   - Recebe a requisição enviada pelo serviço de integração.
   - Realiza uma validação dos dados recebidos.
   - Se a requisição for válida, o SDM cria um novo ticket ou atualiza um já existente.
   - Caso contrário, retorna um erro e encerra o fluxo.

### 2.1 Fluxo de Comunicação

A comunicação entre os componentes segue um fluxo bem definido:

1. **Disparo do Webhook**:
   - O Trello dispara uma requisição HTTP para o serviço de integração sempre que um card for movido para a coluna monitorada. **É necessário realizar a criação do webhook no trello**
2. **Processamento dos Dados**:
   - O serviço de integração analisa os dados do card e verifica a presença de informações necessárias.
3. **Criação do Payload**:
   - Se o card tiver as informações válidas, um JSON estruturado contendo as informações do ticket é gerado, de acordo com a ação esse Json é diferente.
4. **Envio para o SDM**:
   - O serviço de integração envia o JSON para a API do SDM via uma requisição HTTP.
5. **Validação e Criação do Ticket**:
   - O SDM valida a requisição e, se estiver correta, cria ou atualiza o ticket correspondente.

- Observações:
  Todas as requisições para a API do trello exige um token de conta, para obter esse token você deve fazer seu login com a sua conta do trello, o mesmo serve para as requisições do SDM que necessitam de login com a conta institucional.
  Todos os objetos estão devidamente mapeados no código.

## 3. **Tecnologias Utilizadas**

- **Trello API**: Para captura de informações dos cards.
- **Node.js + NestJS**: Serviço intermediário para processar e enviar dados ao ITSM.
- **BMC ITSM API**: Endpoint para criação de tickets.

## 4. Configuração

### 4.1 Criando um Webhook no Trello

- Acesse a API do Trello e gere um token de autenticação.
- Configure um webhook para monitorar mudanças em uma lista especifica do seu board.
- Aponte o webhook para o serviço de integração.

### 4.2 **Configurando o Serviço de Integração**

1. Instale as dependências necessárias:

   ```

   npm install axios @nestjs/common dotenv

   ```

2. Configure as variáveis de ambiente no arquivo `.env`:

   ```
   TRELLO_API_KEY={API_KEY}
   TRELLO_API_TOKEN={YOUR_TOKEN}
   TRELLO_API_SECRET={API_SECRET}
   TRELLO_URL=https://api.trello.com/1

   TRELLO_CUSTOM_NAME={Custtom field to get a name(if you need create more envs)}
   TRELLO_BOARD_ID={Board id]

   BMC_URL_PROD=https://atendimentomoura-restapi.onbmc.com/api
   BMC_URL_QA=https://atendimentomoura-qa-restapi.onbmc.com/api

   BMC_SUPPORT_GROUP_ID={Support group ID}
   BMC_SUPPORT_GROUP_NAME={Support group name}
   CATEGORIZATION_TIER_1={Product category 1}
   CATEGORIZATION_TIER_2={Product category 2}
   CATEGORIZATION_TIER_3={Product category 3}

   LOKI_HOST='https://loki-gateway.grupomoura.com'
   LOKI_LABELS={Integration label}
   LOKI_USERNAME={Loki user}
   LOKI_PASSWORD={Loki password}
   ```

3. Execute o serviço para receber as notificações do Trello e processar a criação dos tickets.

## 5. Endpoints

Endpoint para o swagger: **/api/docs/**

Logs: Todos os logs estão no grafana -> **containerapps: Integração Trello - SDM**

</p>
