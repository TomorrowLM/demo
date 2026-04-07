#include <sys/socket.h>
#include <sys/types.h>     //socket
#include <netinet/ether.h> //ETH_P_ALL
#include <unistd.h>        //close
#include <stdlib.h>        //exit
#include <stdio.h>         //printf
#include <arpa/inet.h>     //htons

#define ERRLOG(errmsg)  \
    do                  \
    {                   \
        perror(errmsg); \
        exit(1);        \
    } while (0)

int main(int argc, char const *argv[])
{
    // 创建原始套接字
    int sockfd;
    if ((sockfd = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL))) < 0)
    {
        ERRLOG("fail to socket");
    }

    // printf("sockfd = %d\n", sockfd);

    // 接收数据并分析
    unsigned char msg[1600] = "";
    while (1)
    {
        // recvfrom recv read 都可以使用
        if (recvfrom(sockfd, msg, sizeof(msg), 0, NULL, NULL) < 0)
        {
            ERRLOG("fail to recvfrom");
        }

        // 分析接收到的数据包
        unsigned char dst_mac[18] = "";
        unsigned char src_mac[18] = "";
        unsigned short type;
        sprintf(dst_mac, "%x:%x:%x:%x:%x:%x", msg[0], msg[1], msg[2], msg[3], msg[4], msg[5]);
        sprintf(src_mac, "%x:%x:%x:%x:%x:%x", msg[6], msg[7], msg[8], msg[9], msg[10], msg[11]);
        type = ntohs(*(unsigned short *)(msg + 12));

        printf("源mac：%s --> 目的mac：%s\n", src_mac, dst_mac);
        printf("type = %#x\n", type);

        if (type == 0x0800)
        {
            printf("ip数据报\n");

            // 头部长度、总长度
            unsigned char ip_head_len;
            unsigned short ip_len;
            ip_head_len = ((*(unsigned char *)(msg + 14)) & 0x0f) * 4;
            ip_len = ntohs(*(unsigned short *)(msg + 16));
            printf("ip头部：%d, ip数据报总长度: %d\n", ip_head_len, ip_len);

            // 目的ip地址、源IP地址
            unsigned char dst_ip[16] = "";
            unsigned char src_ip[16] = "";
            sprintf(src_ip, "%u.%u.%u.%u", msg[26], msg[27], msg[28], msg[29]);
            sprintf(dst_ip, "%u.%u.%u.%u", msg[30], msg[31], msg[32], msg[33]);
            printf("源ip地址：%s --> 目的ip地址：%s\n", src_ip, dst_ip);

            // 协议类型
            unsigned char ip_type;
            ip_type = *(msg + 23);
            printf("ip_type = %d\n", ip_type);
            // icmp、igmp、tcp、udp
            if (ip_type == 1)
            {
                printf("icmp报文\n");
            }
            else if (ip_type == 2)
            {
                printf("igmp报文\n");
            }
            else if (ip_type == 6)
            {
                printf("tcp报文\n");
                unsigned short src_port;
                unsigned short dst_port;
                src_port = ntohs(*(unsigned short *)(msg + 34));
                dst_port = ntohs(*(unsigned short *)(msg + 36));
                printf("源端口号：%d --> 目的端口号: %d\n", src_port, dst_port);
            }
            else if (ip_type == 17)
            {
                printf("udp报文\n");
                // 目的端口号、源端口号
                unsigned short src_port;
                unsigned short dst_port;
                src_port = ntohs(*(unsigned short *)(msg + 34));
                dst_port = ntohs(*(unsigned short *)(msg + 36));
                printf("源端口号：%d --> 目的端口号: %d\n", src_port, dst_port);
            }
        }
        else if (type == 0x0806)
        {
            printf("arp数据报\n");
            // 源ip地址
            // 目的ip地址
            unsigned char dst_ip[16] = "";
            unsigned char src_ip[16] = "";
            sprintf(src_ip, "%u.%u.%u.%u", msg[28], msg[29], msg[30], msg[31]);
            sprintf(dst_ip, "%u.%u.%u.%u", msg[38], msg[39], msg[40], msg[41]);
            printf("源ip地址：%s --> 目的ip地址：%s\n", src_ip, dst_ip);
        }
        else if (type == 0x8035)
        {
            printf("rarp数据报\n");
        }

        printf("\n*****************\n\n");
    }

    close(sockfd);

    return 0;
}


 
