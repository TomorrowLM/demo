#include <stdio.h>

int main(int argc, char *argv[])
{
  //大多数情况下，指针数组都用来保存多个字符串
  char *name[5] = {"Follw me", "BASIC", "Greatwall", "FORTRAN", "Computer"};
  int i;
  printf("%d\n", *name[0]);
  for (i = 0; i < 5; i++)
  {
    printf("%s\n", name[i]);
  }

  return 0;
}
