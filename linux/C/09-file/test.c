#include <stdio.h>  //printf
#include <stdlib.h> //exit

void main()
{
  char buf[128] = "";
  while (1)
  {
    fgets(buf, 2, stdin);
    printf("%s\n", buf);
  }
}