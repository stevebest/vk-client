MOCHA = ./node_modules/.bin/mocha
REPORTER = spec

DOCCO = ./node_modules/.bin/docco

test:
	@$(MOCHA) \
		--reporter $(REPORTER)

doc:
	@$(DOCCO) lib/*.js

.PHONY: test doc
