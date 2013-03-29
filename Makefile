all: join-script-files modularize-script copy-style minify-style lessify-style copy-assets copy-template

include ../../build/modules.mk

MODULE = dialog
MODULARIZE_OPTIONS = -d "ui/position,easing" -css "dialog/default"

SOURCE_SCRIPT_FILES = ${SOURCE_SCRIPT_FOLDER}/jquery.fn.dialog.js \
${SOURCE_SCRIPT_FOLDER}/jquery.dialog.js

SOURCE_STYLE_FILE_PREFIX = 
SOURCE_STYLE_FILE_NAME = default

SOURCE_ASSET_FILES = source/images/*
TARGET_ASSET_FOLDER_NAME = images

TARGET_STYLE_LESS_CONVERTER = sed "s/url(images/url(@{foundry_uri}\/dialog\/images/g"

copy-template: create-script-folder
	cp source/default.ejs ${TARGET_SCRIPT_FOLDER}/default.htm