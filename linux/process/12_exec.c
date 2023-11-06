#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main(int argc, char const *argv[])
{
        pid_t pid;
        if ((pid = fork()) < 0)
        {
                perror("fail to fork");
                exit(1);
        }
        else if (pid > 0) // 父进程
        {
                printf("This is parent process\n");

                wait(NULL);
                int status = 0;
                wait(&status);
                // printf("The child process has quited\n", WIFEXITED(status));

                if (WIFEXITED(status) != 0)
                {
                        printf("The child process has quited\n,The son process return status: %d\n", WEXITSTATUS(status));
                }
                else
                {
                        printf("The son process return status: %d\n", WEXITSTATUS(status));
                }
        }
        else // 子进程
        {
                printf("This is child process\n");

                // 调用exec函数族中的函数，执行其他命令或者程序
                // 查看命令的路径：whereis 命令或者which 命令

                //***************exec函数族调用shell命令******************
                // 不带p的函数，命令的路径一定要用绝对路径
#if 0
        if(execl("/bin/ls", "ls", "-l", NULL) == -1)
        {
            perror("fail to execl");
            exit(1);
        }
#endif

                // 带p的函数，第一个参数既可以是相对路径，也可以是绝对路径
#if 0
        if(execlp("ls", "ls", "-l", NULL) == -1)
        {
            perror("fail to execlp");
            exit(1);
        }
#endif

                // 带v的函数需要使用指针数组来传递
#if 0 
        char *str[] = {"ls", "-l", NULL};
        if(execv("/bin/ls", str) == -1)
        {
            perror("fail to execv");
            exit(1);
        }
#endif
                //***************exec函数族调用可执行文件******************
#if 0       
        if(execlp("./hello", "./hello", NULL) == -1)
        {
            perror("fail to execlp");
            exit(1);
        }
#endif

#if 0
        if(execl("./hello", "./hello", NULL) == -1)
        {
            perror("fail to execl");
            exit(1);
        }
#endif

                //***************exec函数族调用shell脚本******************
#if 1
                if (execlp("./myshell.sh", "./myshell.sh", NULL) == -1)
                {
                        perror("fail to execl");
                        exit(1);
                }
#endif
                // exec函数族取代调用进程的数据段、代码段和堆栈段
                // 所以当exec函数执行完毕后，当前进程就结束了，所以原本进程中的代码不会再执行
                printf("hello world\n");
        }

        return 0;
}