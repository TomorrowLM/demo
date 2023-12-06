#include <stdio.h>

int main(int argc, char const *argv[])
{
    // 由于printf函数是一个标准io，所以只有刷新缓冲区才可以将数据输出到终端
    printf("hello world");

    // 刷新缓冲区方法1：使用\n
    // printf("hello world\n");

    // 刷新缓冲区方法2：程序正常结束
    // printf("hello world");
    // return 0;

    // 刷新缓冲区方法3：使用fflush函数刷新缓冲区
    // printf("hello world");
    // fflush：刷新函数。可以刷新指定的缓冲区
    // stdout：标准输出，就是对终端进行写操作
    // fflush(stdout);

    // 刷新缓冲区方法4：当缓冲区满的时候自动刷新
    // 默认行缓冲的大小为1024个字节
    //  int i;
    //  for(i = 1; i < 300; i++)
    //  {
    //      printf("%03d ", i);
    //  }

    while (1)
        ;

    return 0;
}
