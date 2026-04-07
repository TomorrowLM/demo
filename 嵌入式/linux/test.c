exec函数族
#include <unistd.h>
int execl(const char *path, const char *arg, .../* (char *) NULL */);
int execlp(const char *file, const char *arg, .../* (char *) NULL */);
int execv(const char *path, char *const argv[]);
int execvp(const char *file, char *const argv[]);
int execle(const char *path, const char *arg, .../*, (char *) NULL*/, cha
* const envp[] );
int execvpe(const char *file, char *const argv[], char *const envp[]);
功能：在一个进程里面执行另一个程序，主要用于执行命令
参数：
path：命令或者程序的路径
l：如果是带l的函数，对应的命令或者程序是通过每一个参数进行传
递的，最后一个为NULL表示结束
例如："ls", "‐l", NULL
v:如果是带v的函数，对应的命令或者程序是通过一个指针数组来传递的，
指针数组的最后一个元素为NULL标识结束
char *str[] = {"ls", "‐l", NULL};
p：如果是不带p的函数，第一个参数必须传当前命令或者程序的绝对路径，
如果是带p的函数，第一个参数既可以是绝对路径，也可以是相对路径
返回值：
失败：‐1