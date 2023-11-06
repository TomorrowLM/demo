#ifndef __NIXIE_H__
#define __NIXIE_H__

void FLCD1602_init(void);
void FLCD1602_clear();
void display_string(char *p);
void display_num(char x);
void gotoxy(char y,char x);
void delay(int x);

#endif
