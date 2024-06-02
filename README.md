## Nome
ProAgro SoftFocus

## Descrição
É um software desenvolvido na linguagem de programação Python utilizando as ferramentas FastAPI, PostgreSQL e Javascript. 
É utilizado para manipular comunicações de perda causados por eventos climaticos.

## Instalação
Para a funcionalidade da aplicação, é necassário ter as seguintes ferramentas/frameworks instaladas:
-PostgreSQL versão 14.1 ou superior.
-FastAPI 0.1.0.
-Python 3.10.


## Uso
Passo a passo para a utilização da aplicação:
1° passo : Instale as ferramentas mencionadas no tópico acima.
2° passo : Execute os scripts localizados na pasta Documentos/Scripts DB/ para criar e povoar a tabela no PostgreSQL
3° passo : Abra o arquivo "main.py" localizado na pasta /api.
4° passo : Execute o comando uvicorn main:app --reload no terminal do VS Code.
5° passo: Abra a pasta frontend no VS Code e execute o comando ng serve no terminal.
6° passo: Acesse o link http://localhost:4200/ para utilização.

## Validações

Validações encontradas no front-end.
1° validação CPF : Possui validação de CPF, onde só se pode fazer a alteração e criação da comunicação de perda com um valor de CPF válido.
2° validação e-mail : Possui validação no e-mail, só é possivel a criação ou alteração da comunicação de perda com um valor de e-mail valido, ex: ygorcdc@gmail.com.
3° validação de latitude e longitude : Possui validação de latitude e longitude.
4° validação de campos em brancos : Possui validação de campo em branco em todos os inputs do formulário.

## Testes Opcionais

Dentro da pasta Documentos/ é disponibilizado o arquivo "Proagro - Softfocus.postman_collection.json" para realização de testes pela ferramenta Postman.

## Autores
Ygor César de Carvalho

## Licença
Todos as ferramentas são de códigos open-source.
# Softfocus_Proagro_Js
