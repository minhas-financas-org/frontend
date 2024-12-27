RUN:=yarn

NAME:=greencapital

# STYLE BOX #
ERROR_BOX=\x1b[41m
SUCCESS_BOX=\x1b[42m
RESET_BOX=\x1b[0m
WARN_BOX=\x1b[30;43m

# STYLE COLOR #
ERROR_TEXT=\x1b[31m
SUCCESS_TEXT=\x1b[32m
RESET_TEXT=\x1b[0m
WARN_TEXT=\x1b[33m

# ------------------------------------------------------------------------------------ #

# Função para executar comandos dentro do workspace
define run_in_workspace
	@echo ------------------------------------------------------------------------------;
	@printf "${WARN_BOX} RUNNING ${RESET_BOX}: $(1) - $(2) $(3)\n";
	@echo ;
	@$(RUN) workspace @$(NAME)/$(1) $(2) $(3)

	@if [ $$? -eq 0 ]; then \
		printf "${SUCCESS_BOX} SUCCESS ${RESET_BOX}: $(1) - $(2) $(3)\n"; \
		echo ------------------------------------------------------------------------------; \
	fi
endef

# Extrair parâmetros dos argumentos posicionais
.PHONY: run
run:
	$(eval PROJECT := $(word 2, $(MAKECMDGOALS)))
	$(eval CMD := $(wordlist 3, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS)))
	$(call run_in_workspace,$(PROJECT),$(CMD))

# Para evitar que make tente interpretar os argumentos como alvos
%:
	@:

# ----------------------------------------------- #

setup:
	make clean-builds
	make clean-dependencies
	yarn install
	make build-dependencies

define delete_build
	@echo delete_build $(1)
	rm -Rf ./packages/$(1)/dist
endef

clean-builds:
	$(call delete_build,shared/toolkit)
	$(call delete_build,shared/services)
	$(call delete_build,shared/ui)
	@printf "${SUCCESS_TEXT}>>>> builds deleted successfully ${RESET_TEXT}\n";

define delete_dependencies
	@echo delete_dependencies $(1)
	rm -Rf ./packages/$(1)/node_modules
endef

clean-dependencies:
	rm -Rf ./node_modules
	$(call delete_dependencies,ui)
	$(call delete_dependencies,toolkit)
	$(call delete_dependencies,services)
	@printf "${SUCCESS_TEXT}>>>> dependencies deleted successfully ${RESET_TEXT}\n";

build-dependencies:
	make run toolkit build
	make run services build
	make run ui build

# -------------------- TESTS ------------------- #

toolkit-test:
	$(call run_in_workspace,toolkit,test)

services-test:
	$(call run_in_workspace,services,test)

ui-test:
	$(call run_in_workspace,ui,test)

layout-test:
	$(call run_in_workspace,layout,test)

# -------------------- EMULADOR ------------------- #

# CUIDADO: Este comando irá sobrescrever o path mock
db-write:
	@echo "Starting Firestore emulator with rewrite..."
	@cd packages/db && firebase emulators:start --import ./mock --export-on-exit ./mock

db:
	@echo "Starting Firestore emulator..."
	@cd packages/db && firebase emulators:start --import ./mock