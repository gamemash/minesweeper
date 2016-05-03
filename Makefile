default:
	browserify main.js -o public/js/bundle.js

develop:
	budo main.js:public/js/bundle.js --serve js/bundle.js --live --open --dir ./public -v
