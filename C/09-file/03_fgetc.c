#include <stdio.h>

int main(int argc, char *argv[])
{
  FILE *fp;
  // fp = fopen("C:/Users/李明/Desktop/file.txt", "r");
  fp = fopen("D:/file.txt", "r");
  if (fp == NULL)
  {
    printf("fail to fopen\n");
    return -1;
  }

  // 使用fgetc从文件中读取一个字符
  //    int c = fgetc(fp);
  //    printf("c = [%c] - %d\n", c, c);

  //    c = fgetc(fp);
  //    printf("c = [%c] - %d\n", c, c);

  // 文件的每一行结束的位置都有一个标识，是一个换行符，称之为行结束符
  // fgetc可以读取到行结束符
  int c;
  if ((c = fgetc(fp)) != EOF)
  {
    printf("c = [%c] - %d\n", c, c);
  }
  else
  {
    printf("123");
  }
  // 使用fclose关闭文件
  fclose(fp);
  return 0;
}
