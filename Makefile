SRC_DIR = source
BUILD_DIR = build
FOUNDRY_DIR = ../..
PRODUCTION_DIR = ${FOUNDRY_DIR}/scripts
DEVELOPMENT_DIR = ${FOUNDRY_DIR}/scripts_
UGLIFY = uglifyjs --unsafe -nc

BASE_FILES = ${FOUNDRY_DIR}/build/foundry_intro.js \
${SRC_DIR}/module_intro.js \
${SRC_DIR}/jquery.fn.dialog.js \
${SRC_DIR}/jquery.dialog.js \
${SRC_DIR}/module_outro.js \
${FOUNDRY_DIR}/build/foundry_outro.js

all: body min

body:
	cat ${BASE_FILES} > ${DEVELOPMENT_DIR}/dialog.js
	mkdir ${DEVELOPMENT_DIR}/dialog
	cp ${SRC_DIR}/default.ejs ${DEVELOPMENT_DIR}/dialog/

min:
	${UGLIFY} ${DEVELOPMENT_DIR}/dialog.js > ${PRODUCTION_DIR}/dialog.js
	cp ${SRC_DIR}/default.ejs ${PRODUCTION_DIR}/dialog/
