## **Requisitos e Regras de Negócio \- InfoSuplementos (Versão 0.1)**

### 

### **Requisitos Funcionais (RF)**

* **RF001:** O sistema deve permitir que um novo usuário se cadastre fornecendo nome, endereço de e-mail e senha.  
* **RF002:** O sistema deve validar se o e-mail fornecido no cadastro já existe na base de dados para evitar duplicidade.  
* **RF003:** O sistema deve permitir que um usuário cadastrado realize login utilizando seu e-mail e senha.  
* **RF004:** O sistema deve impedir o login de usuários com credenciais inválidas.  
* **RF005:** O sistema deve apresentar uma mensagem de erro específica caso o e-mail não seja encontrado ou a senha esteja incorreta durante o login.  
* **RF006:** O sistema deve permitir que um usuário autenticado realize logout da sua sessão.  
* **RF007:** O sistema deve permitir que um administrador cadastre suplementos (whey protein e creatina) no banco de dados, incluindo informações como: nome do produto, marca, tipo e status ("Aprovado" ou "Reprovado").  
* **RF008:** O sistema deve permitir que um administrador associe cada suplemento cadastrado à fonte do laudo (ex: ABENUTRI) e, idealmente, uma referência ou link para o laudo.  
* **RF009:** O sistema deve garantir que um suplemento só possa ser cadastrado com um status definido ("Aprovado" ou "Reprovado").  
* **RF010 (Revisado para permitir acesso sem login):** O sistema deve permitir que **qualquer usuário (autenticado ou não)** realize buscas por suplementos cadastrados no banco de dados.  
* **RF011:** O sistema deve permitir a busca de suplementos por nome do produto, marca e/ou status.  
* **RF012:** O sistema deve exibir uma lista de resultados contendo os suplementos que correspondem aos critérios de busca.  
* **RF013:** Para cada suplemento na lista de resultados, o sistema deve exibir, no mínimo: nome do produto, marca, tipo e seu status ("Aprovado" ou "Reprovado").  
* **RF014 (Novo):** O sistema deve registrar e permitir que um **usuário logado** visualize seu histórico de buscas.  
* **RF015 (Novo):** O sistema deve permitir que um **usuário logado** adicione um suplemento à sua lista de favoritos.  
* **RF016 (Novo):** O sistema deve permitir que um **usuário logado** remova um suplemento da sua lista de favoritos.  
* **RF017 (Novo):** O sistema deve permitir que um **usuário logado** visualize sua lista de suplementos favoritos.  
* **RF018:** O sistema deve permitir que um administrador atualize e/ou remova suplementos da base de dados.

### 

### **Requisitos Não Funcionais (RNF)**

* **RNF001 (Usabilidade):** A interface do usuário para as telas de cadastro, login e busca deve ser intuitiva, clara e de fácil navegação.  
* **RNF002 (Usabilidade):** O sistema deve fornecer feedback visual claro ao usuário sobre o resultado de suas ações (ex: mensagens de sucesso, erro, carregamento).  
* **RNF003 (Segurança):** As senhas dos usuários devem ser armazenadas no banco de dados utilizando técnicas de hash seguro.  
* **RNF004 (Segurança):** O sistema deve proteger os dados dos usuários contra acesso não autorizado.  
* **RNF005 (Desempenho):** O tempo de resposta para a autenticação do usuário (login) deve ser, em média, inferior a 2 segundos.  
* **RNF006 (Desempenho):** O tempo de resposta para a busca de suplementos e exibição dos resultados deve ser, em média, inferior a 3 segundos.  
* **RNF007 (Confiabilidade):** O sistema deve ser capaz de lidar com erros de forma controlada, informando o usuário sem travar a aplicação.  
* **RNF008 (Manutenibilidade):** O código-fonte deve ser modularizado e bem documentado para facilitar futuras manutenções e evoluções do sistema.  
* **RNF009 (Compatibilidade):** A aplicação deve ser compatível com os principais navegadores web, e ser responsiva.  
* **RNF010 (Usabilidade):** O sistema deve indicar visualmente, de forma clara, se um suplemento já foi adicionado aos favoritos de um usuário.  
* **RNF011 (Desempenho):** A exibição do histórico de buscas e da lista de favoritos deve ser rápida, com tempo de resposta inferior a 2 segundos.

### 

### 

### 

### **Regras de Negócio (RN)**

### .

* **RN001:** Cada endereço de e-mail pode ser utilizado para cadastrar apenas um único usuário no sistema.  
* **RN002:** Para se cadastrar, o usuário deve fornecer obrigatoriamente nome, e-mail válido e senha.  
* **RN003 (Revisada):** A busca de suplementos deve estar disponível para todos os usuários (logados ou não). No entanto, o **histórico de busca** e a funcionalidade de **favoritos** são exclusivas para usuários autenticados.  
* **RN004:** A senha do usuário deve ter no mínimo 8 caracteres e conter uma combinação de letras e números.  
* **RN005:** Todo suplemento cadastrado deve ser categorizado como "whey protein" ou "creatina".  
* **RN006:** Todo suplemento cadastrado deve possuir um status: "Aprovado" ou "Reprovado". Este status é determinado exclusivamente com base em laudos laboratoriais de entidades reconhecidas (ABENUTRI, Eurofins, etc.).  
* **RN007:** O nome do produto e a marca são campos obrigatórios para o cadastro de um suplemento.  
* **RN008:** A informação sobre a entidade emissora do laudo deve ser registrada para os suplementos reprovados e aprovados.  
* **RN009:** Os resultados da busca devem apresentar de forma clara e destacada o status ("Aprovado","Reprovado" ou “Em análise”) do suplemento.  
* **RN010 (Novo):** O sistema deve armazenar um histórico de, no mínimo, as últimas 20 buscas realizadas por um usuário.  
* **RN011 (Novo):** Um suplemento só pode ser adicionado à lista de favoritos uma única vez por usuário.  
* **RN012 (Novo):** O cadastro e exclusão de novos suplementos é uma ação exclusiva de usuários com perfil de administrador.

# **Especificação de Casos de Uso \- SuppHints (Atualizado)**

Este documento detalha todos os casos de uso definidos para o sistema SuppHints.

**ID:** UC01 **Nome do Caso de Uso:** Realizar Login **Atores:** Utilizador, Administrador **Pré-condições:** O ator deve possuir um cadastro ativo no sistema. 

**Fluxo Principal:**

1. O ator acede ao ecrã de login.  
2. O ator insere o seu email e senha nos campos correspondentes.  
3. O ator clica no botão "Entrar".  
4. O sistema valida as credenciais contra o banco de dados.  
5. O sistema identifica o papel do utilizador (admin ou user).  
6. O sistema exibe o ecrã de busca de suplementos, habilitando as funcionalidades correspondentes ao papel do utilizador. 

**Fluxos Alternativos:**

* **4a. Credenciais Inválidas:** Se o email ou a senha não corresponderem a nenhum registo no banco de dados, o sistema exibe uma mensagem de erro. O ator permanece no ecrã de login. **Pós-condições:** O ator está autenticado no sistema e tem acesso às funcionalidades do seu papel.

**ID:** UC02 **Nome do Caso de Uso:** Realizar Cadastro **Atores:** Visitante, Utilizador (qualquer pessoa sem uma sessão ativa) **Pré-condições:** O ator não deve possuir um cadastro com o email que deseja utilizar. 

**Fluxo Principal:**

1. O ator, no ecrã de login, clica na opção "Cadastro".  
2. O sistema exibe o ecrã de cadastro.  
3. O ator preenche os campos obrigatórios (nome, email, senha, confirmação de senha).  
4. O ator clica no botão "Cadastrar".  
5. O sistema valida os dados (campos preenchidos, formato do email, comprimento da senha, senhas coincidentes).  
6. O sistema insere um novo registo na tabela usuarios com o papel padrão de "user" (eh\_admin \= false).  
7. O sistema exibe uma mensagem de sucesso.  
8. O sistema redireciona o ator para o ecrã de login para que possa autenticar-se.

 **Fluxos Alternativos:**

* **5a. Dados Inválidos:** Se algum dado for inválido, o sistema exibe uma mensagem de erro específica e o ator permanece no ecrã de cadastro para corrigir as informações.  
* **6a. Email Duplicado:** Se o email inserido já existir no banco de dados, o sistema exibe uma mensagem de erro informando que o email já está em uso. **Pós-condições:** Um novo utilizador é permanentemente armazenado no banco de dados.

**ID:** UC03 **Nome do Caso de Uso:** Buscar Suplemento (Atualizado) **Atores:** Visitante, Utilizador, Administrador **Pré-condições:** Nenhuma. 

**Fluxo Principal:**

1. O ator acede ao ecrã de busca.  
2. O ator digita um termo no campo de busca e/ou seleciona um status no filtro ("Todos", "Aprovado", "Reprovado").  
3. O ator inicia a busca (clicando no botão "Buscar" ou mudando o filtro).  
4. O sistema consulta o banco de dados com base nos filtros.  
5. O sistema exibe os resultados na lista.   
   **Fluxos Alternativos:**  
* **5a. Nenhum Resultado Encontrado:** O sistema exibe uma mensagem informando que nenhum resultado foi encontrado. **Pós-condições:** A lista de suplementos é atualizada com os resultados da busca.


**ID:** UC04 **Nome do Caso de Uso:** Visualizar Detalhes do Suplemento (Atualizado) **Atores:** Visitante, Utilizador, Administrador **Pré-condições:** Uma lista de suplementos está a ser exibida.

 **Fluxo Principal:**

1. O ator seleciona um suplemento da lista de resultados.  
2. O ator clica no botão "Ver Detalhes".  
3. O sistema recupera todas as informações do suplemento selecionado no banco de dados.  
4. O sistema exibe um diálogo com todas as informações detalhadas do suplemento. **Pós-condições:** O ator visualizou as informações completas do suplemento selecionado.

   

**ID:** UC05 **Nome do Caso de Uso:** Adicionar Suplemento **Atores:** Administrador **Pré-condições:** O ator deve estar autenticado no sistema com o papel de "Administrador". 

**Fluxo Principal:**

1. O ator, no ecrã de busca, clica no botão "Adicionar".  
2. O sistema exibe o diálogo "Adicionar Novo Suplemento".  
3. O ator preenche os campos com as informações do novo suplemento.  
4. O ator clica no botão "Salvar".  
5. O sistema valida os dados inseridos.  
6. O sistema insere um novo registo na tabela suplementos.  
7. O sistema fecha o diálogo, exibe uma mensagem de sucesso e atualiza a lista de suplementos no ecrã de busca. 

**Fluxos Alternativos:**

* **3a. Cancelar Adição:** Se o ator clicar no botão "Cancelar", o sistema fecha o diálogo sem salvar nenhuma informação.  
* **5a. Dados Inválidos:** Se os dados forem inválidos, o sistema exibe uma mensagem de erro e o ator permanece no diálogo para corrigir. **Pós-condições:** Um novo suplemento é permanentemente armazenado no banco de dados.

**ID:** UC06 **Nome do Caso de Uso:** Remover Suplemento **Atores:** Administrador **Pré-condições:** O ator deve estar autenticado como "Administrador". Um suplemento deve estar selecionado na lista. 

**Fluxo Principal:**

1. O ator seleciona um suplemento na lista de resultados.  
2. O ator clica no botão "Remover".  
3. O sistema exibe um diálogo pedindo confirmação.  
4. O ator confirma a remoção.  
5. O sistema remove o registo do suplemento do banco de dados.  
6. O sistema exibe uma mensagem de sucesso e atualiza a lista de suplementos na tela. 

**Fluxos Alternativos:**

* **4a. Cancelar Remoção:** Se o ator não confirmar a remoção, o sistema fecha o diálogo de confirmação e nenhuma ação é realizada. **Pós-condições:** O suplemento selecionado é permanentemente removido do banco de dados.


**ID:** UC07 (Novo) **Nome do Caso de Uso:** Adicionar Suplemento aos Favoritos **Atores:** Utilizador, Administrador **Pré-condições:** O ator deve estar autenticado no sistema. Um suplemento está a ser visualizado ou selecionado. 

**Fluxo Principal:**

1. O ator clica no ícone ou botão "Adicionar aos Favoritos" de um suplemento.  
2. O sistema regista a associação entre o ID do utilizador e o ID do suplemento na base de dados de favoritos.  
3. O sistema fornece um feedback visual de que o suplemento foi adicionado (ex: o ícone muda de estado). 

**Fluxos Alternativos:**

* **2a. Suplemento já é favorito:** Se o suplemento já estiver na lista de favoritos, a ação de clicar no botão irá removê-lo da lista (comportamento de "toggle"). **Pós-condições:** O suplemento selecionado faz parte (ou deixa de fazer parte) da lista de favoritos do utilizador.


**ID:** UC08 (Novo) **Nome do Caso de Uso:** Exibir Histórico de Busca **Atores:** Utilizador, Administrador **Pré-condições:** O ator deve estar autenticado no sistema. 

**Fluxo Principal:**

1. Durante uma busca (UC03), o sistema regista o termo buscado na base de dados, associado ao ID do utilizador.  
2. O ator clica no botão ou link "Histórico de Busca".  
3. O sistema recupera os últimos termos de busca registados para aquele utilizador.  
4. O sistema exibe o histórico numa lista. 

**Fluxos Alternativos:**

* **4a. Clicar num termo do histórico:** O ator clica num termo de busca do seu histórico. O sistema preenche a barra de busca com aquele termo e executa a busca novamente.  
* **4a. Histórico Vazio:** Se o utilizador ainda não realizou buscas, o sistema exibe uma mensagem informando que o histórico está vazio. **Pós-condições:** O utilizador visualizou e/ou reutilizou as suas buscas anteriores.

## **Trabalhos Relacionados**

O artigo de Ometti e Silveira (2024), publicado na *Revista FT*, discute a relevância do controle de qualidade e da rotulagem de suplementos alimentares proteicos no Brasil, destacando a importância da transparência entre indústria e consumidor. Os autores evidenciam como os avanços regulatórios, em especial a RDC n.º 429/2020 implementada em outubro de 2022, contribuem para uma comunicação mais clara e confiável, dificultando fraudes como o amino spiking e favorecendo escolhas conscientes por parte dos consumidores. Metodologicamente, trata-se de uma revisão bibliográfica fundamentada em estudo conduzido pela ABENUTRI em 2022, de caráter observacional, transversal, descritivo e quantitativo. A pesquisa analisou 124 suplementos proteicos por meio de testes bioquímicos e cromatográficos, com foco na detecção de adulterações na composição declarada nos rótulos. Os resultados apontaram que 39% dos produtos avaliados apresentaram indícios de amino spiking, com variações superiores a 20% entre os aminoácidos declarados e os efetivamente identificados em laboratório, reforçando a necessidade de fiscalização contínua e de rotulagem mais precisa. Apesar de suas contribuições, o estudo apresenta limitações, uma vez que não aprofunda os aspectos técnicos das metodologias empregadas nem explora a percepção do consumidor em relação à clareza das informações nos rótulos. Além disso, baseia-se majoritariamente em um único estudo, carecendo de comparações com outras pesquisas nacionais ou internacionais e de análises longitudinais sobre os impactos práticos da normativa junto ao público. Ainda assim, a pesquisa se conecta diretamente com a problemática abordada no projeto em desenvolvimento, que propõe uma aplicação web voltada à consulta de suplementos como whey e creatina com base em laudos da ABENUTRI. O trabalho oferece um respaldo teórico-normativo atualizado, evidenciando tanto a relevância da exibição de resultados técnicos sobre a qualidade dos produtos quanto a necessidade de traduzir esses dados em informações acessíveis, que permitam ao consumidor compreender rapidamente inconformidades e tomar decisões mais informadas.  
O Artigo Santos, G.M., publicado pela *Revista Brasileira de Nutrição Esportiva*, trata-se de um estudo quantitativo, exploratório e descritivo, onde realizou-se uma análise de diferentes tipos de suplementos esportivos, de diversas marcas. As amostras foram selecionadas conforme indicação de ser suplementos proteicos, sendo escolhidas de acordo com a disponibilidade nas lojas, no municí­pio de Teresina-PI, durante os meses de abril e maio de 2017\. Foram avaliados 20 produtos, destes, apenas 40% (n=8) estavam em conformidade com a legislação, enquanto 60% (n=12) estavam em desacordo.Concluiu-se que a  maioria  dos  rótulos de suplementos proteicos analisados apresentaram inadequações por não obedecerem   ao   que   é   preconizado   pela Resolução nº 18/2010  
O Artigo Rodrigues, M. S & Costa Junior. Publicado pela Revista Brasileira de Nutrição Esportiva, trata-se de um estudo transversal e analí­tico, com amostra de conveniência, que totalizou 41 rótulos de suplementos proteicos, coletados em três lojas especializadas na comercialização desses produtos. A análise da rotulagem foi realizada por meio de um checklist estruturado a partir do Decreto-Lei nº 986/69, das Resoluçõs da Diretoria Colegiada da ANVISA nº 259/2002 e nº 360/203, da Portaria SVS/MS nº 222/98 e da Lei nº 10.674/2003. Todos os rótulos apresentaram alguma inconformidade em relação à legislação corrente.  
O trabalho de graduação VILELA, Camila Souza, fala que dos alimentos para atletas que se sabe atualmente dos efeitos ergogênicos é a creatina, em vista disto o presente estudo tem como objetivo analisar a composição de diferentes rótulos do suplemento creatina com intuito de conferir as conformidades aplicando-se um Checklist baseado na RDC N° 18/2010A busca pelos produtos foi na cidade de Águas Claras, selecionando os que estivessem em português e apresentasse creatina como principal ingrediente para a aplicação do Checklist através de fotos tiradas das mercadorias encontradas. Foram encontrados 21 rótulos de suplementos, todos analisados, sendo que nenhum estava 100% em conformidade com todos os itens descritos na legislação RDC N° 18/10.   
O trabalho de SERENO, S.; MOREIRA, P. Fala sobre adequação de rotulagem: Foram identificados diferentes tipos de inadequações ao regulamento, pois 32,1% das amostras apresentavam algum item em desacordo com a legislação. Dentre as irregularidades encontradas citam-se a falta da frase obrigatória (informando que o produto não substitui a alimentação equilibrada e seu consumo deve ser orientado por nutricionista ou médico) em destaque e negrito (25%), presença de expressões que não podem ser mencionadas (14,3%), apresentaram em sua logomarca uma imagem não conforme (39,3%), não seguiram a legislação vigente quanto à realização da mudança da classificação dos suplementos (7,1%). Os resultados evidenciam a necessidade de uma fiscalização contínua e rigorosa  
Trata-se de uma Resolução da ANVISA, Art. 2º Este regulamento tem o objetivo de estabelecer a classificação, a designação, os requisitos de composição e de rotulagem dos alimentos para atletas.   
[https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2010/res0018\_27\_04\_2010.html](https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2010/res0018_27_04_2010.html)  
	A pesquisa da ABIAD sobre os hábitos de consumo de suplementos alimentares no Brasil, realizada em 2020, revelou que, Presença nos lares: Em 59% dos lares brasileiros, pelo menos uma pessoa consumia suplementos alimentares. Crença na melhoria da saúde: A maioria dos entrevistados, 78%, acredita que os suplementos contribuem para aprimorar a saúde. Preferência por suplementos: Um dado relevante é que 63% dos participantes da pesquisa afirmaram preferir ingerir suplementos a modificar seus hábitos alimentares para alcançar um objetivo de saúde.  
	O artigo de Ronald J. Maughan, "Quality assurance issues in the use of dietary supplements, with special reference to protein supplements" (Questões de garantia de qualidade no uso de suplementos alimentares, com referência especial a suplementos de proteína), publicado no *The Journal of Nutrition* em 2012, aborda os riscos associados ao consumo de suplementos alimentares, especialmente os de proteína, que são muito populares entre atletas e praticantes de exercícios. Os principais pontos são Riscos de suplementos não regulamentados, Ausência de ingredientes ativos, Presença de substâncias nocivas**.**  
O trabalho foi publicado na Revista do Instituto Adolfo Lutz. Tem o objetivo deste trabalho foi avaliar a conformidade de suplementos proteicos para atletas, do tipo whey protein, quanto à composição centesimal e requisitos para rotulagem. Os parâmetros da composição nutricional para os quais foram identificadas não conformidades foram teores de lipídeos totais (70 %) e carboidratos (30 %).Não conformidades de rotulagem foram evidenciadas em 100 % das amostras, sendo mais frequentes aquelas relacionadas à informação da medida caseira, prazo de validade, indicação terapêutica e denominação de venda.

## **Referências**

* Santos, G. M., Sousa, P. V. L., Oliveira, J. M. S., Saldanha, N. M. V. P., Neiva, R. C., & Barros, N. V. A. (2018). Análise da rotulagem de suplementos proteicos comercializados na cidade de Teresina-PI. *Revista Brasileira de Nutrição Esportiva*, *12*(70), 255-261. Recuperado em 11 de outubro de 2020, de [http://www.rbne.com.br/index.php/rbne/article/view/1023](http://www.rbne.com.br/index.php/rbne/article/view/1023)  
* Rodrigues, M. S., & Costa Júnior, A. L. R. (2017). Avaliação da rotulagem de suplementos proteicos comercializados em lojas especializadas em São Luís-MA. *Revista Brasileira de Nutrição Esportiva*, *11*(64), 420-427. Recuperado em 21 de abril de 2021, de [http://www.rbne.com.br/index.php/rbne/article/view/822](http://www.rbne.com.br/index.php/rbne/article/view/822)  
* VILELA, Camila Souza; SILVA, Maria Cláudia da. **ANÁLISE DA COMPOSIÇÃO NUTRICIONAL DE DIFERENTES MARCAS DE SUPLEMENTO CREATINA**. 2018\. Trabalho de Conclusão de Curso (Graduação em Nutrição) – Centro Universitário de Brasília (UniCEUB), Brasília, 2018\. [https://repositorio.uniceub.br/jspui/bitstream/prefix/13309/1/21803023.pdf](https://repositorio.uniceub.br/jspui/bitstream/prefix/13309/1/21803023.pdf)  
* BRASIL. Alimentos e embalagens isentos da obrigatoriedade de registro sanitário anexo i. ANVISA, v. 2010, p. 2, 2010b  
* SERENO, S.; MOREIRA, P. Avaliação da Adequação da Rotulagem de Suplementos Esportivos. Revista Corpus et Scientia, v. 9, n. 2, p. 45–55, 2013\.  
* BRASIL. Resolução RDC no 18, de 27 de abril de 2010\. Regulamento Técnico sobre Alimentos para Atletas. Agencia Nacional de Vigilância Sanitária (ANVISA), v. 2010, 2010a.  
* ABIAD. Pesquisa: Hábitos de consumo de Suplementos Alimentares no Brasil. Disponível em: https://abiad.org.br/2021/wp-content/uploads/2020/09/Infografico-1-Pesquisa-Suplementos-Alimentares-2020.pdf.   
* MAUGHAN, Ronald J. Quality assurance issues in the use of dietary supplements, with special reference to protein supplements. The Journal of nutrition, v. 143, n. 11, p. 1843S-1847S, 2012\.   
* SILVA, L. V.; SOUZA, S. V. C. Qualidade de suplementos proteicos: avaliação da composição e rotulagem. Revista do Instituto Adolfo Lutz, v. 75, n. 1703, p. 1-17, 2016\. URL: [https://pesquisa.bvsalud.org/portal/resource/pt/biblio-982790](https://pesquisa.bvsalud.org/portal/resource/pt/biblio-982790)  
* OMETTI, Márcio de Roma Guimarães; SILVEIRA, Sacha Yelena Santos. A nova ordem no controle de qualidade e rotulagem em suplementos alimentares proteicos. **Revista FT**, 27 fev. 2024\. Disponível em: [https://revistaft.com.br/a-nova-ordem-no-controle-de-qualidade-e-rotulagem-em-suplementos-alimentares-proteicos/](https://revistaft.com.br/a-nova-ordem-no-controle-de-qualidade-e-rotulagem-em-suplementos-alimentares-proteicos/).