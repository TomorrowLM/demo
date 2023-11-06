#include <REGX52.H>
#include "LCD1602.h"

void main()
{
	char i,sec = 56;
	FLCD1602_init();
	FLCD1602_clear();
	while(1)
	{
		FLCD1602_clear();
		display_string("hello");
		gotoxy(2,0);
		display_string("2022/02/13");
		delay(50000);delay(50000);delay(50000);delay(50000);
		FLCD1602_clear();
		display_string("Time:");display_num(sec);display_string(" ");display_num(i);
		gotoxy(2,0);
		display_string("end");
		delay(50000);delay(50000);delay(50000);delay(50000);
		i++;
		if(i>100)i = 0;
	}
}