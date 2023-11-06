#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

#define MAXLEN 225

typedef struct
{
  char ch[MAXLEN];
  int length;
} String;

void get_next(String T, int next[])
{
  // int i = 1, j = 0; // i领先一个位置
  // next[1] = 0;
  // while (i < T.length)
  // {
  //   if (j == 0 || T.ch[i] == T.ch[j]) // 如果j=0时,意味着当前i无法和模式串匹配,i需要向后移动
  //   {
  //     i++;
  //     j++; // i++相当于next[j]赋值给next[j+1],j++相当于移动到可以直接匹配的位置
  //     next[i] = j;
  //   }
  //   else
  //   {
  //     j = next[j]; // 回退
  //   }
  // }
  int j = 0;
  next[0] = 0;
  // printf("ooo:%d\n", next[0]);
  for (int i = 1; i < T.length; i++)
  {
    while (j > 0 && T.ch[i] != T.ch[j]) // j要保证大于0，因为下面有取j-1作为数组下标的操作
    {
      j = next[j - 1]; // 注意这里，是要找前一位的对应的回退位置的后一位和当前的i比较
    }
    // printf("%d %c\n", j, T.ch[j]);
    if (T.ch[i] == T.ch[j])
    { // 如果
      j++;
    }
    // printf("j=%d\n", j);
    next[i] = j;
  }
  // printf("ooo:%d\n", next[0]);
  // printf("ooo:%d\n", next[1]);
}

int Index_KMP(String S, String T, int next[])
{
  int i = 0, j = 0;
  printf("\n%d\n", S.length);
  while (i < S.length && j < T.length)
  {
    printf("%c %c %d\n", S.ch[i], T.ch[j], j);
    if (j == 0 || S.ch[i] == T.ch[j])
    {
      i++, j++; // 匹配成功,i和j向后移动
    }
    else
    {
      j = next[j - 1]; // j回调可以直接匹配的位置
    }
  }
  printf("1 %d", i);
  if (j > T.length - 1)
    return i - T.length + 1; // 不需要+1,因为while1循环退出之前i++,用来while循环判断了
  else
    return 0;
}

int main()
{
  SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
  String s1 = {ch : "aabaabaabaabaabaaaa", length : strlen(s1.ch)};
  String s2 = {ch : "baa", length : strlen(s2.ch)}; // s1母串,s2子串
  char a[MAXLEN], b[MAXLEN];

  int next[MAXLEN];
  get_next(s2, next);
  printf("%d\n", s1.length);
  printf("next数组如下\n");
  // printf("ooo:%d\n", next[0]);
  // printf("ooo:%d\n", next[1]);
  for (int i = 0; i <= s2.length - 1; i++)
  {
    printf("%d", next[i]);
  }
  printf("匹配位置:%d\n", Index_KMP(s1, s2, next));
  return 0;
}
