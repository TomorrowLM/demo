#include "../index.h"

struct stu
{
  int score;
  char name[200];
} STU;

typedef struct student
{
  /* data */
  char ch;
  struct student *next;
} CHARSTU;

void main()
{
  char *buf_point = "hello world";
  struct stu liming[1] = {{score : 1, name : "liming"}};
  printf("%s", liming->name);

  CHARSTU *ch = (CHARSTU *)malloc(sizeof(CHARSTU));
  printf("%d\n", sizeof(ch));
}