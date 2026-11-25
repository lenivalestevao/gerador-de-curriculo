# Gerador de Currículo

Gerador de currículo **gratuito**, com **6 modelos** e **PDF** para baixar. Roda inteiro no navegador: seus dados não são enviados a nenhum servidor.

**Demo online:** https://lenivalestevao.github.io/gerador-de-curriculo/

## Recursos

- **6 modelos:** Clássico, Moderno, Minimalista, Executivo, Criativo e Compacto
- **Prévia ao vivo** em folha A4, enquanto você digita
- **PDF com texto real** (selecionável e legível por sistemas ATS, sem virar imagem)
- **Cor e tamanho da letra** ajustáveis, com aviso de quantas páginas o currículo ocupa
- **Importar do LinkedIn** a partir da cópia dos seus dados (ZIP), lida só no seu navegador
- **Salvar e abrir** seus dados em arquivo `.json`
- **Salvamento automático** no navegador e botão **Desfazer** ao trocar tudo
- Sem foto, de propósito: a maioria dos sistemas de seleção ignora ou atrapalha com foto
- Sem dependências, sem build: HTML, CSS e JavaScript puro

## Como usar

1. Abra a demo (ou o arquivo `index.html`).
2. Preencha os dados, ou clique em **Carregar exemplo** para ver como fica.
3. Escolha o modelo, a cor e o tamanho da letra.
4. Clique em **Baixar PDF**. Na janela de impressão escolha **Salvar como PDF**, papel **A4** e desligue "Cabeçalhos e rodapés".

## Importar do LinkedIn

O LinkedIn não oferece uma API aberta para ler perfis, então o caminho é a cópia dos seus dados:

1. No LinkedIn: **Eu → Configurações e privacidade → Privacidade de dados → Obter uma cópia dos seus dados**.
2. Peça os dados básicos (ou escolha Perfil, Cargos, Formação, Habilidades, Idiomas e Certificações) e baixe o ZIP quando chegar o e-mail.
3. No gerador, clique em **Importar do LinkedIn** e envie o ZIP (ou os arquivos `.csv`).

O arquivo é lido localmente no navegador. Telefone, site e link do LinkedIn não vêm na cópia, então você preenche à mão. Confira os textos depois de importar: eles vêm exatamente como estão no LinkedIn.

## Privacidade

Nada é enviado para fora. Os dados ficam no `localStorage` do seu navegador e nos arquivos que você mesmo salvar. Para apagar, use o botão **Limpar**.

## Rodar localmente

Não precisa de build nem de servidor:

```bash
git clone https://github.com/lenivalestevao/gerador-de-curriculo.git
cd gerador-de-curriculo
# abra index.html no navegador
```

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Página, formulário e prévia |
| `style.css` | Interface e os 6 modelos do currículo |
| `app.js` | Dados, prévia, PDF e importação do LinkedIn |

## Criar um modelo novo

1. Em `style.css`, crie as regras com a classe `.t-seumodelo` (veja os modelos existentes como base).
2. Em `app.js`, adicione `['seumodelo', 'Seu Modelo']` na lista `TEMPLATES`.

## Contribuir

Sugestões, modelos novos e correções são bem-vindos: abra uma issue ou um pull request.

## Licença

MIT. Uso livre, pessoal e comercial.

## Contato

lenivalestevaojr@gmail.com
