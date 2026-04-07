cc = gcc
# gcc .\index.c .\lib\link-create.c -o index
# $(cc) index.c .\lib\link-create.c .\lib\link_print.c -o index
main:	index.c
			gcc index.c .\lib\subString.c .\lib\subCompare.c .\lib\subLength.c -o index.exe
			./index.exe

test:	test.c
			gcc test.c -o test.exe
			./test.exe

app:	./app/kmp.c
			gcc ./app/kmp.c -o kmp.exe