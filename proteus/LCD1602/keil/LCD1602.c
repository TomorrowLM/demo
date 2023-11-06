#include <REGX52.H>

unsigned char *num[] = "0123456789"; 

void delay(int x)
{
	while(x--);	
} 
/***向LCD写一个命令**/
void write_command(char command)
{
	P2_1 = 0;
	P2_2 = 0;
	P0 = command;
	P2_0 = 1;
	delay(100);//等待接收，忽略读状态操作
	P2_0 = 0;
	P2_1 = 1;
} 
/***向LCD写一个数据**/
void write_data(char date)
{
	P2_1 = 0;
	P2_2 = 1;
	P0 = date;
	P2_0 = 1;
	delay(100);//等待接收
	P2_0 = 0;
	P2_1 = 1;
} 
/**初始化**/
void FLCD1602_init(void)
{
	write_command(0x38);//两行，每行16个字符，每个字符是5*7点阵
	write_command(0x0f);//光标显示并闪烁
	//write_command(0x0c);//光标不显示
	write_command(0x06);//光标随字符右移
}  
/**清屏**/
void FLCD1602_clear()
{
	write_command(0x01);
	write_command(0x02);
}
/**向LCD写字符串**/
void display_string(char *p)
{
	while(*p)//字符非空
	{
		write_data(*p);//写字符
		p++;             //数据指针++
	}
}
/**向LCD写数字变量**/
void display_num(char x)
{
	write_data(num[x / 10]);
	write_data(num[x % 10]);
}
/**定位**/
void gotoxy(char y,char x)
{
	if(y == 1)
	write_command(0x40 + x);
	else if(y == 2)
	write_command(0x80 + 0x40 + x);
}				

