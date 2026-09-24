# 🧠 REGRAS DE PERSISTÊNCIA & WORKFLOW DO PROJETO (AGENTS.MD)

As diretrizes a seguir devem ser obedecidas estritamente em todas as interações e desenvolvimentos deste projeto:

## 1. Atualização Contínua da Documentação
Ao final de **qualquer alteração** (nova feature, fix de bug, refatoração ou ajuste de layout), os três arquivos abaixo **DEVEM** ser inspecionados e atualizados obrigatoriamente:
1. `CONTEXTO.md`: Registrar mudanças arquiteturais, novos módulos ou novos fluxos.
2. `DOCUMENTACAO.md`: Manter a especificação técnica dos componentes, tokens e funções em dia.
3. `PASSOS.md`: Marcar com `[x]` as tarefas finalizadas.

## 2. Roteiro Passo a Passo
- O desenvolvimento deve seguir a ordem estrita de prioridades definida no arquivo `PASSOS.md`.
- **NUNCA** inicie o próximo passo ou fase sem que o usuário peça explicitamente ("continue", "próximo passo", "faça o passo X", etc.).

## 3. Geração Automática de Texto para Commit
Sempre ao final da resposta de qualquer implementação ou correção, gere um bloco destacado com o **Texto para Commit** seguindo o padrão *Conventional Commits*:
- Formato: `tipo(escopo): descrição curta em português`
- Tipos comuns: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `perf:`
- Detalhamento sucinto das mudanças realizadas.
