#include "../index.h"

// 链表的遍历
void stack_print(STU *head)
{
  STU *p_mov;
  // 定义新的指针保存链表的首地址，防止使用head改变原本链表
  p_mov = head;
  // 当指针保存最后一个结点的指针域为NULL时，循环结束
  while (p_mov != NULL)
  {
    // 先打印当前指针保存结点的指针域
    printf("num=%d score=%d name:%s\n", p_mov->num,
           p_mov->score, p_mov->name);

    // 指针后移，保存下一个结点的地址
    p_mov = p_mov->next;
  }
}