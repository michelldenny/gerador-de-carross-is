# Plano de implantação revisado — IA BrandsDecoded

## Decisões incorporadas

### 1. Três modos formais

- `quick`: geração compacta, cinco slides e validações essenciais.
- `custom`: respeita quantidade, formato, marca e objetivo escolhidos pelo usuário.
- `editorial`: perfil BrandsDecoded estrito, nove slides, formato 1080×1350, arco editorial e revisão severa.

### 2. Fronteira segura

O navegador chama somente `POST /api/ai/carousels`. O provedor, prompts, regras e segredos ficam em módulos `server-only`. Segredos nunca usam o prefixo `NEXT_PUBLIC_`. Autenticação, rate limit, créditos autoritativos e persistência devem ser conectados antes de habilitar um provedor pago; o saldo Zustand permanece apenas demonstrativo.

### 3. Versionamento auditável

Rulesets, prompts, schemas e validadores possuem versões independentes e hashes de conteúdo. Cada execução retorna um trace com versão do contrato, ruleset, validador, provedor e IDs dos trechos recuperados.

### 4. Validação por natureza

- Determinística: schema, contagens, ordem, templates, frases proibidas, CTA, evidências exigidas e limites.
- Heurística: repetição, possíveis claims, densidade aproximada e promessa narrativa.
- Editorial por modelo/humano: fluidez, naturalidade, profundidade, cumprimento semântico e qualidade do fechamento.

Uma heurística nunca é apresentada como prova determinística.

### 5. Perfil visual compatível

O modo editorial restringe o formato a vertical e usa uma seleção determinística de templates existentes enquanto o renderer BrandsDecoded completo não é introduzido. A intenção visual continua separada do texto; React controla a renderização. Fontes e exportação precisam usar ativos locais antes do rollout visual definitivo.

## Sequência executável

1. Formalizar contratos e modos.
2. Criar manifesto e catálogo de regras versionadas.
3. Implementar schemas e validadores determinísticos.
4. Introduzir Route Handler e provider server-only.
5. Fazer a UI consumir a API interna.
6. Aplicar seletor visual por modo.
7. Adicionar revisão e correção incremental.
8. Conectar pesquisa factual com evidências persistidas.
9. Conectar autenticação, banco, rate limit e créditos autoritativos.
10. Liberar provedor pago somente após os itens de segurança.

## Critérios de aceite

- Nenhum segredo ou SDK de provedor no bundle do navegador.
- Nenhuma chamada envia integralmente os seis documentos.
- Toda resposta passa por JSON Schema/Zod e validadores locais.
- Modo editorial aplica nove slides e formato vertical.
- Cada execução registra versões e trechos usados.
- Claims factuais relevantes podem ser bloqueados por ausência de evidência.
- Correções futuras operam apenas sobre campos reprovados e têm limite de tentativas.
