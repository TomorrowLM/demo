#include "./index.h"

struct String
{
  /* data */
  char ch[255];
};

void main()
{
  struct String stuString;
  // strcpy(stuString.ch, "1324");
  stuString.ch[0] = '1';
  stuString.ch[1] = '1';
  printf("%s\n", stuString.ch);
  // printf("%c\n", stuString[2]);
}