#include <stdio.h>
#include <stdlib.h>

void test1()
{
  char *p;
  p = (char *)malloc(100);

  //在100个字节后面追加50个字节
  p = (char *)realloc(p, 150); // p指向的内存的新的大小为150个字节
}

void test2()
{
  char *p;
  p = (char *)malloc(100);

  //想重新申请内存,新的大小为50个字节
  p = (char *)realloc(p, 50); // p指向的内存的新的大小为50个字节,100个字节的后50个字节的存储空间就被释放了
}

int main(int argc, char *argv[])
{
  test1();

  return 0;
}
