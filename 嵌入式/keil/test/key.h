#ifndef __KEY_H__
#define __KEY_H__
unsigned char key();
#endif
 
//ÖÐ¶Ïº¯Êý
//unsigned int T0Count;
//void Timer0_Routine() interrupt 1
//{
//	TL0 = 0x18;		
//	TH0 = 0xFC;		
//	T0Count++;
//	if(T0Count>=500)
//	{
//		T0Count=0;
//		if(LEDmood==1)
//			P2=_crol_(P2,1);
//		if(LEDmood==2)
//			P2=_cror_(P2,1);
//		if(LEDmood==3)
//			P2=_cror_(P2,0);
//	}
//}