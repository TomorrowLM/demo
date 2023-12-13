#include <sys/socket.h>
#include <sys/types.h>        //socket
#include <stdio.h>            //printf
#include <unistd.h>           //close
#include <stdlib.h>           //exit
#include <netinet/ether.h>    //ETH_P_ALL
#include <netpacket/packet.h> //sockaddr_ll
#include <sys/ioctl.h>        //ioctl
#include <net/if.h>           //ifreq
#include <string.h>           //strncpy
#include <strings.h>          //bzero
#include <arpa/inet.h>        //htons

#define ERRLOG(errmsg)  \
    do                  \
    {                   \
        perror(errmsg); \
        exit(1);        \
    } while (0)

// 使用arp协议通过对方ip地址获取mac地址

int main(int argc, char const *argv[])
{
    // 创建原始套接字
    int sockfd;
    if ((sockfd = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL))) < 0)
    {
        ERRLOG("fail to socket");
    }

    // 组数据包
    // 源mac地址：00:0c:29:7b:35:d7
    //00:0c:29:7f:6c:33
    unsigned char msg[1600] = {
        // 组以太网首部
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, // 目的mac地址，广播地址
        0x00, 0x0c, 0x29, 0x7f, 0x6c, 0x33, // ubuntu源mac地址
        0x08, 0x06,                         // 帧类型 arp报文：0x0806

        // 组arp报文
        0x00, 0x01,                         // 硬件类型 以太网：1
        0x08, 0x00,                         // 协议类型 ip地址：0x0800
        6,                                  // 硬件地址长度
        4,                                  // 协议地址长度
        0x00, 0x01,                         // op arp请求：1
        0x00, 0x0c, 0x29, 0x7f, 0x6c, 0x33, // ubuntu源mac地址
        192, 168, 110, 24,                   // ubuntu源ip地址
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 目的mac地址,不清楚
        192, 168, 110, 151                     // windows目的ip地址
    };

    // 获取接口信息
    // 将arp请求报文发送出去，通过ens33发送出去
    // 使用ioctl函数获取本机网络接口
    struct ifreq ethreq;
    strncpy(ethreq.ifr_name, "ens33", IFNAMSIZ);
    if (ioctl(sockfd, SIOCGIFINDEX, &ethreq) == -1)
    {
        perror("fail to ioctl");
        exit(1);
    }

    // 设置本机网络接口
    struct sockaddr_ll sll;
    bzero(&sll, sizeof(sll));
    sll.sll_ifindex = ethreq.ifr_ifindex;

    // 发送数据
    if (sendto(sockfd, msg, 14 + 28, 0, (struct sockaddr *)&sll, sizeof(sll)) < 0)
    {
        ERRLOG("fail to sendto");
    }

    unsigned char recv_msg[1600] = "";
    unsigned char mac[18] = "";
    while (1)
    {
        // 接收数据并分析
        if (recvfrom(sockfd, recv_msg, sizeof(recv_msg), 0, NULL, NULL) < 0)
        {
            ERRLOG("fail to recvfrom");
        }

        // 如果是arp数据包并且是arp应答，则打印源mac地址
        if (ntohs(*(unsigned short *)(recv_msg + 12)) == 0x0806)
        {
            if (ntohs(*(unsigned short *)(recv_msg + 20)) == 2)
            {
                sprintf(mac, "%x:%x:%x:%x:%x:%x", recv_msg[6], recv_msg[7], recv_msg[8], recv_msg[9], recv_msg[10], recv_msg[11]);
                printf("192.168.110.%d --> %s\n", msg[41], mac);
                break;
            }
        }
    }

    close(sockfd);

    return 0;
}
