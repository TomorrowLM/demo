#include "../index.h"

void link_creat_head(STU **p_head, STU *p_new)
{
  // printf("%p\n", p_head);
  // printf("%p\n", &p_head);
  STU *p_mov = *p_head; // p_mov保存当前链表中指向的对象
  if (p_head == NULL)   // 当第一次加入链表为空时，head执行p_new
  {
    p_head = p_new; // 将第一个节点赋值给head
    // printf("%p\n", p_head);
    // printf("%p\n", &p_head);
    p_new->next = NULL;
  }
  else // 第二次及以后加入链表
  {
    while (p_mov->next != NULL)
    {
      p_mov = p_mov->next; // 找到原有链表的最后一个节点
    }
    p_mov->next = p_new; // 将新申请的节点加入链表
    p_new->next = NULL;
  }
}