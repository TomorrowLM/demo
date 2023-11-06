#include <stdio.h>
#include <stdlib.h>
#include <string.h>
// 定义结构体类型
typedef struct
{
  char name[32];
  int age;
  // 定义结构体变量之定义结构体类型的同时定义结构体变量
} stu;

void fn(stu **a)
{

  stu *b = (stu *)malloc(sizeof(stu));
  strcpy(b->name, "b1");
  // a.name='b1';
  // strcpy(a->name, "b1");
  printf("%p\n", **a); // 堆地址
  printf("%p\n", *a);  // 指针的地址
  printf("%p\n", a);   // 指针的地址的地址
  printf("%p\n", &a);  // 指针的地址的地址
  printf("=======\n");
  *a = b;              // 指向一级指针的地址为b指针的地址
  printf("%p\n", **a); // 堆地址
  printf("%p\n", *a);  // 指针的地址
  printf("%p\n", a);   // 指针的地址的地址
  printf("=======\n");
  printf("%p\n", *b);
  printf("%p\n", b);
  printf("%p\n", &b);
  printf("=======\n");
}

int main(int argc, char *argv[])
{
  // 结构体变量的初始化
  stu *zhaoliu = (stu *)malloc(sizeof(stu));
  zhaoliu->age = 12;
  strcpy(zhaoliu->name, "a1");
  printf("%p\n", *zhaoliu); // 堆地址
  printf("%p\n", zhaoliu);  // 指针的地址
  printf("%p\n", &zhaoliu); // 指针的地址的地址
  printf("%p\n", &zhaoliu); // 指针的地址的地址
  printf("=======\n");
  fn(&zhaoliu);
  printf("%p\n", &zhaoliu);
  printf("%d,%s", sizeof(zhaoliu), &zhaoliu->name);
  return 0;
}
