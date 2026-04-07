#include <reg52.h>

#define uint unsigned int
#define uchar unsigned char
	
sbit LE_D = P2^6;		//LE_D控制显示那个数字
sbit LE_W = P2^7;		//LE_W控制第几个数码管显示

uchar num;
uchar code table[] = {			//code 数据会放在程序存储器当中，如果不用code就会放在随机存储器当中
	0x06,0x5B,0x4F,0x66,0x6D,0x7C,0x07,0x7F,0x6F//单片机的随机存储器RAM是有限的(51单片机只有128字节)
};
void delay(uint time);
void main()
{
	LE_W = 1;
	P0 = 0xD5;	//打开第 1 3 5 的数码管   1101 0101 
	LE_W = 0;
	while(1){
		for(num = 0; num < 9; num++){
			LE_D = 1;
			P0 = table[num];		//每隔1s数据变一下 从0——>9 显示
			LE_D = 0;
			delay(1000);	//1s
		}
	}
}

void delay(uint time)  //delay = 1 ms 0.001s
{
	uint y;
	uint z;
	for(z = time; z > 0; z--){
			for(y = 115; y > 0; y--){}
	}
}
