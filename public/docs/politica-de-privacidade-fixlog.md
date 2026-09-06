# Política de Privacidade - FixLog

O aplicativo **FixLog** foi desenvolvido pelo ecossistema Aresta Climb como uma ferramenta técnica voltada à segurança, documentação e auditoria de proteções em vias de escalada.

Esta política descreve de forma clara e transparente quais permissões são utilizadas, como seus dados são armazenados localmente e como as informações são protegidas.

---

## 1. Princípio do Armazenamento Local e Soberania dos Dados (Offline-First)

O FixLog foi construído com arquitetura estritamente **offline-first**:
- Os seus dados de identidade (nome, e-mail público, chave pública e certificado de mantenedor) e todos os relatórios em andamento são armazenados **exclusivamente no banco de dados local (Isar)** do seu dispositivo.
- Nenhuma foto, vídeo ou coordenada geográfica de vias em auditoria é transmitida automaticamente para servidores remotos sem o seu comando explícito de compartilhamento ou exportação.

---

## 2. Permissões de Dispositivo Solicitadas

Para viabilizar a auditoria técnica de vias, o FixLog solicita as seguintes permissões do sistema operacional:

### A. Câmera
- **Finalidade:** Captura de fotos detalhadas das proteções fixas (grampos, chapeletas, paradas, tipo de aço e desgaste por corrosão).
- **Uso:** As fotos são armazenadas na pasta de sessão do rascunho local e embutidas com compressão no relatório PDF final assinado. A câmera nunca é acessada em segundo plano.

### B. Localização Precisa (GPS)
- **Finalidade:** Registro das coordenadas geográficas (latitude, longitude e altitude aproximada) no exato instante em que a foto da proteção é registrada.
- **Uso:** Assegura que o laudo técnico comprove o local exato da intervenção na parede, impedindo fraudes ou identificação equivocada de vias. O GPS só é ativado durante o registro de evidências ativas na tela do assistente de vistoria.

---

## 3. Criptografia e Assinatura Digital

Os laudos técnicos gerados pelo FixLog utilizam chaves criptográficas locais do mantenedor para assinar os relatórios em formato PDF. A chave privada de assinatura permanece protegida no armazenamento seguro do seu celular (Secure Storage / Keystore) e nunca é enviada para qualquer servidor externo.

---

## 4. Dados de Diagnóstico e Erros (Crashlytics)

Para garantir a estabilidade do motor nativo em Rust e da montagem de relatórios pesados, o aplicativo pode coletar relatórios técnicos anônimos de falha (stack traces de crashes, modelo do aparelho e versão do sistema operacional). Esses dados destinam-se exclusivamente à correção de bugs e melhoria da robustez da aplicação.

---

## 5. Seus Direitos (LGPD)

Como os dados ficam sob controle direto no seu próprio aparelho, você pode a qualquer momento:
- Modificar ou excluir seus dados de identidade diretamente na tela de Configurações.
- Excluir o histórico de laudos locais e fotos associadas.
- Revogar as permissões de Câmera e Localização nas configurações do seu sistema operacional Android ou iOS.

---

## 6. Contato e Vigência

Para dúvidas sobre esta política, visite nosso portal em [arestaclimb.com](https://arestaclimb.com) ou entre em contato pelo e-mail oficial da comunidade Aresta Climb.

Esta política entra em vigor a partir de 03 de Setembro de 2026.
