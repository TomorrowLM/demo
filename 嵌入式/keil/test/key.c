#include"Delay.h"
#include <REGX52.H>
unsigned char key()
{
	unsigned char keynum = 0;
	if(P3_1==0){Delay(20);while(P3_1==0);Delay(20);keynum=1;}
	if(P3_0==0){Delay(20);while(P3_0==0);Delay(20);keynum=2;}
	if(P3_2==0){Delay(20);while(P3_2==0);Delay(20);keynum=3;}
	if(P3_3==0){Delay(20);while(P3_3==0);Delay(20);keynum=4;}
	return keynum;
}