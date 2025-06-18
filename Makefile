start:
	npx start-server -s ./frontend/dist

build:
	npm run build

install:
	npm install
	
lint:
	npx eslint .

lint-fix:
	npx eslint --fix .
run:
	cd ./frontend && npm run dev