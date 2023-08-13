pull:
	git pull gitlab master

build:
	../node_modules/.bin/graphql-codegen --config etc/codegen.yml

run:
	ts-node index.ts