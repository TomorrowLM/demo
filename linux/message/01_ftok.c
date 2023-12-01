#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>

int main(int argc, char const *argv[])
{
    //使用ftok函数获取键值
    //只要保证ftok的第一个参数对应的文件和第二个参数值相同，则不管程序运行多少遍或者多少个进程或者键值,键值一定都是唯一的
    key_t mykey;
    if((mykey = ftok(".", 100)) == -1)
    {
        perror("fail to ftok");
        exit(1);
    }

    printf("key = %#x\n", mykey);

    
    return 0;
}