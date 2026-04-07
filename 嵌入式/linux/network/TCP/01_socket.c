#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <stdlib.h>

int main(int argc, char const *argv[])
{
    //通过socket函数创建一个TCP套接字
    int sockfd;
    if((sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1)
    {
        perror("fail to socket");
        exit(1);
    }

    printf("sockfd = %d\n", sockfd);

    return 0;
}
