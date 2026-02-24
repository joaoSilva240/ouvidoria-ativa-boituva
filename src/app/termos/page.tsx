"use client";

import { Navbar } from "@/components/Navbar";

export default function TermosPage() {
    return (
        <main className="min-h-screen bg-bg-secondary font-sans text-text-primary transition-colors duration-300">
            <Navbar />

            <section className="mx-auto w-[90%] max-w-[1600px] px-2 py-10 md:px-4 md:py-12">
                <header className="mb-6 md:mb-8">
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                        Termo de Responsabilidade e Política de Tratamento de Dados Pessoais
                    </h1>
                    <p className="max-w-5xl text-sm leading-relaxed text-text-secondary md:text-base">
                        Documento oficial da Ouvidoria Ativa da Prefeitura Municipal de Boituva/SP.
                    </p>
                </header>

                <article className="overflow-hidden rounded-3xl border border-border-color bg-bg-card shadow-lg dark:shadow-none">
                    <div className="space-y-7 p-5 md:p-7 text-text-secondary">
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">1. Objetivo do Termo</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Este Termo estabelece as condições de uso do Sistema de Ouvidoria Ativa da Prefeitura
                                Municipal de Boituva/SP, por meio da Secretaria de Governo e Planejamento Estratégico
                                – Departamento de Inovação Governamental. O sistema destina-se a receber, registrar,
                                acompanhar e responder manifestações de cidadãos (elogios, sugestões, reclamações,
                                denúncias, pedidos de informação etc.) sobre serviços públicos locais. Cada
                                manifestação identificada gera um protocolo único para acompanhamento. Ao usar o
                                sistema, o usuário concorda com as regras abaixo, em conformidade com a Lei nº
                                12.527/2011 (LAI) e a Lei nº 13.709/2018 (LGPD).
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">2. Dados Coletados e Cadastro</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Para cadastro ou registro de manifestação, o sistema coleta os seguintes dados
                                pessoais: nome completo, CPF, E-mail e número de telefone. São considerados dados
                                necessários para identificar e contatar o cidadão no acompanhamento de sua demanda. Na
                                apresentação da manifestação o cidadão poderá optar por indicar identificação completa
                                ou registrar-se de forma anônima. Em caso de manifestação identificada, será exigido
                                o nome e demais informações acima; em caso anônimo, esses campos poderão ficar em
                                branco. Importante: a identificação do usuário é dado pessoal sensível na ótica da
                                transparência pública, e por isso seu acesso é restrito (ver “Sigilo das
                                Manifestações” abaixo). Mesmo assim, a identidade do autor permanece classificada
                                como informação pessoal protegida.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                2.1 Exemplos de manifestações: elogios, solicitações de providência, reclamações
                                sobre serviços públicos, denúncias de irregularidades, ou Solicitações de amparo
                                quanto a um serviço prestado.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                2.2 Protocolo: Cada manifestação identificada recebe um número único (protocolo) para
                                acompanhamento. Manifestações anônimas também são registradas.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                2.3 Consentimento: O uso do sistema implica ciência e concordância com este Termo.
                                Não são coletados outros dados sem aviso prévio.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">3. Base Legal</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                O tratamento dos dados pessoais pelo sistema de ouvidoria apoia-se nas bases legais
                                previstas na LGPD para o setor público. Em especial, aplica-se cumprimento de
                                obrigação legal ou regulatória e execução de políticas públicas (arts. 7º, II e III e
                                art. 11, §1º, II da LGPD). Assim, não se fundamenta no consentimento dos titulares,
                                mas no interesse público. A Lei de Acesso à Informação (LAI) também se aplica:
                                informações pessoais e sigilosas (identidade do manifestante e teor das
                                manifestações) são protegidas e devem ter acesso restrito. A Constituição Federal
                                garante transparência pública (Art.5º, XXXIII) e assegura que o sigilo só é exceção
                                para informações cuja divulgação comprometeria a segurança do Estado.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                Este Termo atende aos requisitos da LAI e da LGPD: observa os princípios de
                                finalidade, necessidade, adequação, transparência, segurança e responsabilização
                                previstos na LGPD, bem como o princípio de publicidade da LAI (informação pública é a
                                regra, sigilo é exceção). Em especial, cumpre a obrigação legal de proteger dados de
                                identificação, intimidade, honra ou imagem dos cidadãos.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                4. Sigilo das Manifestações e Acesso às Informações
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Todas as manifestações registradas no sistema têm tratamento sob sigilo. A
                                identificação do manifestante é considerada “informação pessoal protegida com
                                restrição de acesso nos termos da LAI”. O teor das manifestações, por sua vez, só
                                pode ser acessado pelos responsáveis (especialmente pelo ouvidor) com a finalidade de
                                apuração e providências sobre o conteúdo apresentado. Em outras palavras, apenas os
                                servidores autorizados ao tratamento de dados da ouvidoria podem ver estas
                                informações, e somente para responder às demandas. Todas as operações de acesso
                                (visualização, edição, resposta, exclusão) são registradas em logs para auditoria
                                interna, garantindo rastreabilidade das ações.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                O sistema conta com controle de acesso reforçado: cada usuário autorizado (incluindo o
                                próprio ouvidor) deve utilizar credenciais individuais (login e senha fortes) e
                                renová-las periodicamente. É obrigatória a assinatura de termo de confidencialidade
                                por todos os colaboradores que tenham acesso ao sistema ou façam manutenção (TI,
                                suporte, prestadores de serviço). Essas boas práticas mitigam riscos de vazamento e
                                cumprem as exigências da governança em tecnologia da informação e proteção de dados.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">5. Segurança da Informação</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                A Prefeitura adota medidas de segurança compatíveis com padrões oficiais para proteger
                                os dados coletados: infraestrutura de servidores segura, criptografia das
                                comunicações, backups regulares e firewalls. No entanto, a Prefeitura não pode
                                garantir 100% de invulnerabilidade contra ataques sofisticados ou falhas de terceiros.
                                Conforme termo de responsabilidade padrão, emprega-se as melhores práticas de mercado,
                                mas o município não se responsabiliza por eventuais danos decorrentes de acessos não
                                autorizados ou falhas de conectividade fora de seu controle. O usuário também se
                                compromete a manter seus dispositivos livres de vírus e a não divulgar suas
                                credenciais.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">6. Compartilhamento de Dados</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Os dados pessoais só serão compartilhados com outros órgãos ou pessoas quando
                                necessário ao atendimento da manifestação e desde que haja base legal (por exemplo,
                                investigação de denúncias ou cumprimento de decisão judicial). Dados não serão cedidos
                                para fins de marketing, pesquisas comerciais ou outras finalidades sem previsão legal.
                                Em todo compartilhamento, serão observadas as finalidades originais e as proteções da
                                LGPD.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">7. Direitos do Titular de Dados</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Conforme a LGPD, o cidadão titular dos dados tem direitos assegurados. Em particular,
                                poderá, quando aplicável, confirmar a existência de tratamento, acessar os dados
                                registrados, corrigir informações incompletas ou desatualizadas, solicitar
                                anonimização, bloqueio ou eliminação de dados excessivos ou desnecessários,
                                portabilidade e revogar consentimento já dado. A ouvidoria orientará sobre como
                                exercer esses direitos: solicitações podem ser feitas aos canais oficiais da
                                Prefeitura. Quando o titular solicitar, será fornecido retorno em prazo razoável, nos
                                termos da legislação vigente.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">8. Responsabilidade do Usuário</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Ao usar este sistema, o cidadão declara fornecer apenas informações verdadeiras e
                                declara estar ciente de que:
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                8.1 É proibido inserir conteúdo ilegal, ofensivo, discriminatório ou que viole
                                direitos de terceiros. Manifestações manifestamente falsas ou criminosas serão
                                comunicadas às autoridades competentes.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                8.2 O uso indevido do sistema (tentativa de invasão, acesso indevido ou uso para
                                outros fins) acarretará em responsabilização legal. A Prefeitura pode suspender ou
                                bloquear o acesso de usuários que descumprirem este Termo.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                8.3 Todos os dados fornecidos são de responsabilidade do usuário, inclusive no que se
                                refere à precisão. Atualize suas informações sempre que necessário.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">9. Disposições Finais</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Este Termo poderá ser atualizado para refletir mudanças na lei ou nas políticas
                                internas da Prefeitura. O uso contínuo do sistema implica ciência e concordância com o
                                texto vigente. Em caso de dúvidas ou mais informações sobre privacidade, acesse o
                                Portal da LGPD da Prefeitura de Boituva ou entre em contato com o Encarregado de
                                Dados (DPO) pelo canal oficial.
                            </p>
                            <p className="pt-2 text-sm leading-relaxed md:text-base">
                                Boituva/SP
                                Departamento de Inovação Governamental – Secretaria de Governo e Planejamento
                                Estratégico – Prefeitura de Boituva
                            </p>
                        </section>
                    </div>
                </article>
            </section>
        </main>
    );
}

