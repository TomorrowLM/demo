#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

// 使用无名管道实现父子进程间的通信
// 由于无名管道创建之后给当前进程两个文件描述符，所以如果是完全不相关的进程
// 无法获取同一个无名管道的文件描述符，所以无名管道只能在具有亲缘关系的进程间通信

int main(int argc, char const *argv[])
{
    // 创建一个无名管道
    int pipefd[2];
    if (pipe(pipefd) == -1)
    {
        perror("fail to pipe");
        exit(1);
    }

    // 使用fork函数创建子进程
    pid_t pid;
    if ((pid = fork()) < 0)
    {
        perror("fail to fork");
        exit(1);
    }
    else if (pid > 0) // 父进程
    {
        // 父进程负责给子进程发送数据
        char buf[128] = {};
        while (1)
        {
            sleep(1);
            printf("等待输入\n");
            fgets(buf, sizeof(buf), stdin);
            printf("输入成功\n");
            buf[strlen(buf) - 1] = '\0';

            if (write(pipefd[1], buf, sizeof(buf)) == -1)
            {
                perror("fail to write");
                exit(1);
            }
        }
    }
    else // 子进程
    {
        // 子进程接收父进程的数据
        char buf[128] = "";
        while (1)
        {
            if (read(pipefd[0], buf, sizeof(buf)) == -1)
            {
                perror("fail to read");
                exit(1);
            }

            printf("from parent: %s\n", buf);
        }
    }

    return 0;
}