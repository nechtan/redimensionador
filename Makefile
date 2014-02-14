# nechtan@me.com

NPMI=npm i

all: 
	$(NPMI)

osx:
	brew install imagemagick --build-from-source
	$(NPMI)

centos:
	sudo yum install ImageMagick-c++ ImageMagick-c++-devel
	$(NPMI)

ubuntu:
	sudo apt-get install libmagick++-dev
	$(NPMI)

clean:
	rm -rf node_modules
	