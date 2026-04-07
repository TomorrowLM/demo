#include "../index.h"

int subCompare(SString s1, SString s2)
{

  for (int i = 0; i < s1.length && i < s2.length; i++)
  {
    if (s1.ch[i] != s2.ch[i])
    {
      return s1.ch[i] - s2.ch[i];
    }
  }
  // 扫描字符相同，比较串的大小
  return s1.length - s2.length;
}
