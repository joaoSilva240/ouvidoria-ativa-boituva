"use client";

import { Navbar } from "@/components/Navbar";

export default function PrivacidadePage() {
    return (
        <main className="min-h-screen bg-bg-secondary font-sans text-text-primary transition-colors duration-300">
            <Navbar />

            <section className="mx-auto w-[90%] max-w-[1600px] px-2 py-10 md:px-4 md:py-12">
                <header className="mb-6 md:mb-8">
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                        Política de Privacidade
                    </h1>
                    <p className="max-w-5xl text-sm leading-relaxed text-text-secondary md:text-base">
                        Política de tratamento de dados pessoais da Ouvidoria Ativa da Prefeitura
                        Municipal de Boituva/SP.
                    </p>
                </header>

                <article className="overflow-hidden rounded-3xl border border-border-color bg-bg-card shadow-lg dark:shadow-none">
                    <div className="space-y-7 p-5 md:p-7 text-text-secondary">
                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">1. Introdução</h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Esta Política de Privacidade explica como a Ouvidoria Ativa da
                                Prefeitura Municipal de Boituva/SP ("Ouvidoria") coleta, usa,
                                armazena e protege os dados pessoais fornecidos por cidadãos
                                (titulares dos dados) por meio do nosso sistema de gestão de
                                manifestações.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                Nosso compromisso é garantir a proteção da privacidade e da
                                segurança de seus dados pessoais, em conformidade com a Lei
                                nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD) e a
                                Lei nº 12.527/2011 (Lei de Acesso à Informação - LAI).
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                2. Quais dados coletamos?
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Coletamos os seguintes dados pessoais quando você se registra ou
                                manifesta no sistema:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>Nome completo</li>
                                <li>CPF (Cadastro de Pessoa Física)</li>
                                <li>E-mail pessoal</li>
                                <li>Número de telefone (celular)</li>
                                <li>Endereço IP e dados técnicos do dispositivo</li>
                            </ul>
                            <p className="text-sm leading-relaxed md:text-base">
                                Para manifestações identificadas, os dados acima são obrigatórios.
                                Para manifestações anônimas, esses campos podem ficar em branco,
                                mas o sistema ainda registra dados técnicos necessários para a
                                segurança da plataforma.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                3. Para que usamos seus dados?
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Seus dados pessoais são utilizados exclusivamente para as
                                seguintes finalidades:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>
                                    Registrar e processar suas manifestações (elogios,
                                    sugestões, reclamações, denúncias e pedidos de informação)
                                </li>
                                <li>Comunicar o andamento e resposta às suas demandas</li>
                                <li>
                                    Garantir a segurança e integridade do sistema de ouvidoria
                                </li>
                                <li>Cumprir obrigações legais e regulatórias</li>
                                <li>
                                    Realizar pesquisas de satisfação e melhoria dos serviços
                                    públicos
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                3. Base legal para o tratamento de dados
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                O tratamento de dados pessoais na Ouvidoria baseia-se nas
                                seguintes legalidades previstas na LGPD:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>
                                    <strong>Cumprimento de obrigação legal:</strong> O sistema
                                    é exigido por lei para atendimento de demandas públicas
                                    (Art. 7º, II da LGPD)
                                </li>
                                <li>
                                    <strong>Execução de políticas públicas:</strong> A Ouvidoria
                                    é componente essencial da gestão participativa e da
                                    prestação de serviços públicos (Art. 7º, III da LGPD)
                                </li>
                                <li>
                                    <strong>Interesse legítimo:</strong> Adequação ao objetivo
                                    institucional da Ouvidoria (Art. 7º, X da LGPD)
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                5. Direitos do titular de dados
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Conforme a LGPD, você tem direito a:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>
                                    Confirmar a existência de tratamento de seus dados
                                </li>
                                <li>Acessar seus dados pessoais</li>
                                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                                <li>
                                    Solicitar anonimização, bloqueio ou eliminação de dados
                                    desnecessários ou processados em violação à legislação
                                </li>
                                <li>
                                    Solicitar portabilidade dos dados a outro fornecedor de
                                    serviço ou produto (desde que não haja exigência legal)
                                </li>
                                <li>
                                    Revogar o consentimento, quando aplicável (embora o
                                    tratamento baseie-se em outras bases legais)
                                </li>
                                <li>
                                    Solicitar information sobre os terceiros com quem
                                    compartilhamos seus dados
                                </li>
                            </ul>
                            <p className="text-sm leading-relaxed md:text-base">
                                Para exercer seus direitos, entre em contato conosco pelos
                                canais oficiais da Ouvidoria. Responderemos em até 15 dias,
                                conforme prazo legal estabelecido na LGPD.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                6. Compartilhamento de dados
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Seus dados pessoais não são compartilhados com terceiros para
                                fins comerciais ou de marketing. O compartilhamento ocorre
                                apenas nas seguintes situações:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>
                                    Entre órgãos públicos, quando necessário para a
                                    apuração da manifestação e prestação do serviço público
                                </li>
                                <li>
                                    Por determinação judicial ou obrigação legal
                                    previamente estabelecida
                                </li>
                                <li>
                                    Com prestadores de serviços que atuam sob estrita
                                    confidencialidade e com finalidade limitada ao serviço
                                    contratado
                                </li>
                            </ul>
                            <p className="text-sm leading-relaxed md:text-base">
                                Todas as manifestações são tratadas com sigilo, e o acesso aos
                                dados é restrito apenas aos servidores autorizados da
                                Ouvidoria.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                7. Segurança da informação
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                A Prefeitura Municipal de Boituva adota medidas técnicas e
                                organizacionais para proteger seus dados pessoais contra:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>Acesso não autorizado</li>
                                <li>Úso indevido, alteração ou divulgação</li>
                                <li>Destruição, perda ou alteração indevida</li>
                            </ul>
                            <p className="text-sm leading-relaxed md:text-base">
                                As medidas incluem criptografia de dados em trânsito e em
                                repouso, firewalls, controle de acesso biométrico em
                                    servidores físicos, auditorias regulares e treinamento
                                    contínuo da equipe de tecnologia.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                8. Armazenamento e retenção de dados
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Seus dados pessoais são armazenados em servidores seguros
                                localizados no Brasil, com backup diário e protocolos de
                                recuperação de desastres.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                O período de retenção dos dados segue as normas arquivísticas
                                vigentes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed md:text-base">
                                <li>
                                    Dados de manifestações: 5 anos (prazo legal de
                                    prescrição administrativa)
                                </li>
                                <li>
                                    Dados de usuários cadastrados: até a solicitação de
                                    exclusão ou cancelamento da conta
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                9. Atualizações desta política
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Esta Política de Privacidade poderá ser atualizada para
                                refletir mudanças em nossas práticas ou em compliance com
                                novas obrigações legais. A versão mais recente estará sempre
                                disponível neste link.
                            </p>
                            <p className="text-sm leading-relaxed md:text-base">
                                Recomendamos que você revise esta política periodicamente.
                                O uso contínuo do sistema após quaisquer modificações
                                constitutes aceitação dos termos atualizados.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-bold text-text-primary">
                                10. Contato
                            </h2>
                            <p className="text-sm leading-relaxed md:text-base">
                                Para dúvidas sobre esta Política de Privacidade ou para
                                exercer seus direitos de titular de dados, entre em contato
                                conosco pelos seguintes canais:
                            </p>
                            <div className="bg-bg-secondary p-4 rounded-xl border border-border-color space-y-2 text-sm">
                                <p>
                                    <strong className="text-text-primary">Ouvidoria da
                                    Prefeitura de Boituva</strong>
                                </p>
                                <p>Email: ouvidoria@boituva.sp.gov.br</p>
                                <p>Telefone: (15) XXXX-XXXX</p>
                                <p>
                                    Endereço: Rua XXX, S/N - Centro, Boituva - SP, CEP XXXXX-XXX
                                </p>
                            </div>
                            <p className="text-sm leading-relaxed md:text-base">
                                Também você pode entrar em contato com nosso Encarregado de
                                Dados (DPO) pelo email: dpo@boituva.sp.gov.br
                            </p>
                        </section>
                    </div>
                </article>
            </section>
        </main>
    );
}
