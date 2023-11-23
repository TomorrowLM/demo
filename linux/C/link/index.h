#ifndef LINK
#define LINK

#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

typedef struct student
{
  // 数据域
  int num;       // 学号
  int score;     // 分数
  char name[20]; // 姓名
  // 指针域
  struct student *next;
} STU, *STUList;

void link_creat_head(STU *p_head, STU *p_new);
void link_print(STU *p_head);

#endif
