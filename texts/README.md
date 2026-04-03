# Textos do site

Os textos traduziveis do site ficam nesta pasta.

## Estrutura
- `PT-BR/` = Portugues (padrao)
- `EN/` = Ingles
- `ES/` = Espanhol

Cada idioma tem arquivos por secao:
- `header.txt`
- `about.txt`
- `interests.txt`
- `timeline.txt`
- `highlights.txt`
- `projects.txt`
- `talks.txt`
- `contact.txt`
- `footer.txt`

## Formato dos arquivos `.txt`
Use uma chave por linha:

`chave=valor`

Exemplo:

`projects.title=Projetos`

## Dicas
- Mantenha as mesmas chaves em todos os idiomas.
- Em textos longos, pode usar HTML simples como `<br><br>`.
- Se uma chave nao existir em um idioma, o conteudo atual da pagina sera mantido.
