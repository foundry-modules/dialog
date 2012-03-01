include ../../build/modules.mk

MODULE = dialog
FILENAME = ${MODULE}.js
RAWFILE = ${DEVELOPMENT_DIR}/${MODULE}.raw.js

SOURCE = ${SOURCE_DIR}/module_intro.js \
${SOURCE_DIR}/jquery.fn.dialog.js \
${SOURCE_DIR}/jquery.dialog.js \
${SOURCE_DIR}/module_outro.js

PRODUCTION = ${PRODUCTION_DIR}/${FILENAME}
DEVELOPMENT = ${DEVELOPMENT_DIR}/${FILENAME}
PRODUCTION_FOLDER = ${PRODUCTION_DIR}/${MODULE}
DEVELOPMENT_FOLDER = ${DEVELOPMENT_DIR}/${MODULE}

all: raw module min clean

raw:
	cat ${SOURCE} > ${RAWFILE}

module:
	${MODULARIZE} -n "${MODULE}" -m ${RAWFILE} > ${DEVELOPMENT}

	mkdir -p ${DEVELOPMENT_FOLDER}
	mkdir -p ${DEVELOPMENT_FOLDER}/images
	cp ${SOURCE_DIR}/default.ejs ${DEVELOPMENT_FOLDER}/
	cp ${SOURCE_DIR}/images/* ${DEVELOPMENT_FOLDER}/images/
	cp ${SOURCE_DIR}/default.css ${DEVELOPMENT_FOLDER}/default.css

min:
	${UGLIFYJS} ${DEVELOPMENT} > ${PRODUCTION}

	mkdir -p ${PRODUCTION_FOLDER}
	mkdir -p ${PRODUCTION_FOLDER}/images
	cp ${SOURCE_DIR}/default.ejs ${PRODUCTION_FOLDER}/
	cp ${SOURCE_DIR}/images/* ${PRODUCTION_FOLDER}/images/
	${UGLIFYCSS} ${SOURCE_DIR}/default.css > ${PRODUCTION_FOLDER}/default.css

clean:
	rm -fr ${RAWFILE}

uninstall:
	rm -fr ${PRODUCTION}
	rm -fr ${PRODUCTION_FOLDER}
	rm -fr ${DEVELOPMENT}
	rm -fr ${DEVELOPMENT_FOLDER}
