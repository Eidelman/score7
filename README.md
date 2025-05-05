## Instalação
Primeiro, 
. abra o projecto no vscode
. abra o terminal e corra o seguinte comando:
pnmp install

## Configuração de base de dados
. Criar base de dados: score7
. Modificar DATABASE_URL no ficheiro .env para:
DATABASE_URL=postgresql://postgres:sua_palavra-passe@localhost:5432/score7

## Configurar Primas
Na linha de comando corra o seguinte comando para criar as tabelas na base de dados:
pnpm exec prisma migrate dev --name init

## Como correr a aplicação
No terminal corra o seguinte comando para ligar o servidor:
pnpm run dev

## Getting Started
Abra http://localhost:3000 como o navegador para ver a aplicação
