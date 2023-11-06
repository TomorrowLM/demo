#ifndef STRING
#define STRING

#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

#define MAXLEN 255 //  1个字节最多能存255个数字

typedef struct
{
  // 数据域
  char ch[MAXLEN];
  // 指针域
  int length;
} SString;

int subString(SString **Sub, SString S, int pos, int len);
int subCompare(SString s1, SString s2);
int subLength(SString S);
#endif
