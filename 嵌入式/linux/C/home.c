#include "stdio.h"

#define prices 100 // 每次交100元
#define people 5   // 人数
#define num 1      // 缴费次数

typedef struct name
{
  int count[num]; // 使用次数
  float money[num]; // 每次给的钱
  float remain;     // 剩余的钱
} name;

int allMoney(float money[num])
{
  float moneys = 0;
  for (int i = 0; i < num; i++)
  {
    moneys = moneys + money[i];
  }
  return moneys;
}

void main()
{
  int days[num] = {20};     // 缴费后使用的天数
  float unitPrice[num] = {0}; // 每次缴费的单价
  name liming = {count : {20}, money : {25}, remain : 0};
  name a = {count : {20}, money : {25}, remain : 0};
  name b = {count : {20}, money : {25}, remain : 0};
  name c = {count : {15}, money : {25}, remain : 0};
  name d = {count : {0}, money : {0}, remain : 0};
  for (int i = 0; i < num; i++)
  {
    int mm = liming.count[i] + a.count[i] + b.count[i] + c.count[i] + d.count[i];
    unitPrice[i] = prices / mm;
  }
  for (int i = 0; i < num; i++)
  {
    liming.remain = liming.remain + liming.money[i] - liming.count[i] * unitPrice[i];
  }
  printf("%f\n", unitPrice[0]);
  printf("%f\n", liming.remain);
}