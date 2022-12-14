#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int main()
{
  char *str = (char *)malloc(10 * sizeof(char));
  char string[100] = "i love c";
  char *sting1 = "i love c";
  printf("%p", sting1[1]);
  return 0;
}