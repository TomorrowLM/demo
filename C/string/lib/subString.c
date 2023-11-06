#include "../index.h"

int subString(SString **Sub, SString S, int pos, int len)
{
  SString *newSub = *Sub;
  printf("%d\n", pos + len);
  //子串范围超出长度
  if (pos + len - 1 > S.length)
  {
    return 0;
  }
  for (int i = pos; i < pos + len; i++)
  {
    printf("====%c\n", S.ch[i]);
    newSub->ch[i - pos] = S.ch[i];
  }
  newSub->ch[len] = '\0';
  printf("%c\n", newSub->ch[2]);
  printf("%c\n", newSub->ch[3]);
  printf("12\n");
  newSub->length = len;
  return 1;
}
