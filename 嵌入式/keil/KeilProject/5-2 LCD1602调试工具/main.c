#include <REGX52.H>
#include "LCD1602.h";	//包含LCD1602头文件



void main(void)
{
	LCD_Init();
	while(1)
	{
		goto_xy(1,0);
		LCD_ShowString(1,2,"HELLO WORLD");
	}
}	
