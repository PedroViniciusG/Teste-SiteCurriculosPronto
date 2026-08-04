# Currículos 1R$

Gerador de currículos em PDF com seis modelos, páginas públicas para SEO e pagamento PIX pelo Mercado Pago.

## Executar localmente

```bash
cp .env.example .env
npm install
npm start
```

Acesse `http://localhost:3000`.

## Verificar antes de publicar

```bash
npm run check
```

## Documentação

- `docs/ESTRUTURA.md`: função de cada pasta e arquivo.
- `docs/DEPLOY.md`: publicação no Render.
- `docs/SEGURANCA.md`: cuidados de produção.

## GitHub

Pode enviar todo o projeto, exceto `.env`, `node_modules/` e arquivos privados já cobertos pelo `.gitignore`.


## Página de ajuda

A rota `/ajuda` reúne orientações sobre pagamento, PDF, edição, reembolso e contato. O e-mail exibido vem da variável `CONTACT_EMAIL`.
