test:
	./node_modules/.bin/mocha

doc:
	./node_modules/.bin/docco lib/*.js

.PHONY: test doc
