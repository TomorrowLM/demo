#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

typedef struct
{
  int data;
  char name[10];
} stu, *stuPoint;

stu change1(stu name1)
{
  strcpy(name1.name, "li");
  return name1;
}

stuPoint change2(stuPoint name1)
{
  strcpy(name1->name, "li");
  return name1;
}
int main(int argc, char *argv[])
{
  SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
  stu li;
  li.data = 12;
  strcpy(li.name, "12");
  // change1(li);
  change2(&li);
  printf("%s,%d", li.name, li.data);
  return 0;
}
