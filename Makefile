include ../../build/modules.mk
SRC_DIR = source
BUILD_DIR = build

BASE_FILES = ${FOUNDRY}/build/foundry_intro.js \
${SRC_DIR}/module_intro.js \
${SRC_DIR}/jquery.fn.dialog.js \
${SRC_DIR}/jquery.dialog.js \
${SRC_DIR}/module_outro.js \
${FOUNDRY}/build/foundry_outro.js

all: body min

body:
	mkdir -p ${LIBRARY_DEV}/dialog
	mkdir -p ${LIBRARY_DEV}/dialog/images

	cat ${BASE_FILES} > ${LIBRARY_DEV}/dialog.js
	cp ${SRC_DIR}/default.ejs ${LIBRARY_DEV}/dialog/
	cp ${SRC_DIR}/images/* ${LIBRARY_DEV}/dialog/images/
	cp ${SRC_DIR}/default.css ${LIBRARY_DEV}/dialog/default.css

min:
	mkdir -p ${LIBRARY_PRO}/dialog
	mkdir -p ${LIBRARY_PRO}/dialog/images

	${UGLIFYJS} ${LIBRARY_DEV}/dialog.js > ${LIBRARY_PRO}/dialog.js
	cp ${SRC_DIR}/default.ejs ${LIBRARY_PRO}/dialog/
	cp ${SRC_DIR}/images/* ${LIBRARY_PRO}/dialog/images/
	${UGLIFYCSS} ${SRC_DIR}/default.css > ${LIBRARY_PRO}/dialog/default.css


clean:
	rm -fr ${LIBRARY_PRO}/dialog.js
	rm -fr ${LIBRARY_PRO}/dialog
	rm -fr ${LIBRARY_DEV}/dialog.js
	rm -fr ${LIBRARY_DEV}/dialog
