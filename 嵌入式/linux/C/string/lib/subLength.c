#include "../index.h"

int subLength(SString S)
{
  for (int i = 0; i < S.length; i++)
  {
    if (!S.ch[i])
    {
      return i + 1;
    }
  }
}
