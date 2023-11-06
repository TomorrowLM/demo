#include <stdio.h>
#include <stdlib.h>
// 定义结点结构体
typedef struct student
{
  // 数据域
  int num;       // 学号
  int score;     // 分数
  char name[20]; // 姓名
  // 指针域
  struct student *next;
} STU;

void link_creat_head(STU **p_head, STU *p_new)
{
  STU *p_mov = *p_head;
  if (*p_head == NULL) // 当第一次加入链表为空时，head执行p_new
  {
    *p_head = p_new;
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

// 链表的遍历
void link_print(STU *head)
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

// 链表的释放
void link_free(STU **p_head)
{
  // 定义一个指针变量保存头结点的地址
  STU *pb = *p_head;

  while (*p_head != NULL)
  {
    // 先保存p_head指向的结点的地址
    pb = *p_head;
    // p_head保存下一个结点地址
    *p_head = (*p_head)->next;
    // 释放结点并防止野指针
    free(pb);
    pb = NULL;
  }
}

// 链表的查找
// 按照学号查找
STU *link_search_num(STU *head, int num)
{
  STU *p_mov;
  // 定义的指针变量保存第一个结点的地址
  p_mov = head;
  // 当没有到达最后一个结点的指针域时循环继续
  while (p_mov != NULL)
  {
    // 如果找到是当前结点的数据，则返回当前结点的地址
    if (p_mov->num == num) // 找到了
    {
      return p_mov;
    }
    // 如果没有找到，则继续对比下一个结点的指针域
    p_mov = p_mov->next;
  }

  // 当循环结束的时候还没有找到，说明要查找的数据不存在，返回NULL进行标识
  return NULL; // 没有找到
}

// 按照姓名查找
STU *link_search_name(STU *head, char *name)
{
  STU *p_mov;
  p_mov = head;
  while (p_mov != NULL)
  {
    if (strcmp(p_mov->name, name) == 0) // 找到了
    {
      return p_mov;
    }
    p_mov = p_mov->next;
  }
  return NULL; // 没有找到
}

int main()
{
  STU *head = NULL, *p_new = NULL;
  int num, i;
  printf("请输入链表初始个数:\n");
  scanf("%d", &num);
  for (i = 0; i < num; i++)
  {
    p_new = (STU *)malloc(sizeof(STU));  // 申请一个新节点
    printf("请输入学号、分数、名字:\n"); // 给新节点赋值
    scanf("%d %d %s", &p_new->num, &p_new->score, p_new->name);

    link_creat_head(&head, p_new); // 将新节点加入链表
  }

  link_print(head);

  // 查学号
#if 1
  STU *pb;
  while (1)
  {
    printf("请输入您要查找学生的学号\n");
    scanf("%d", &num);
    pb = link_search_num(head, num);
    if (pb != NULL) // 找到了
    {
      printf("找到了 num=%d score=%d name:%s\n", pb->num, pb->score, pb->name);
    }
    else
    {
      printf("没有找到您要查找的节点\n");
    }
  }
#endif

  // 查姓名
#if 0
    char name[32] = "";
    while(1)
    {
        printf("请输入您要查找学生的姓名\n");
        scanf("%s",name);
        pb=link_search_name(head,name);
        if(pb!=NULL)//找到了
        {
            printf("找到了 num=%d score=%d name:%s\n",pb->num,pb->score,pb->name);
        }
        else
        {
            printf("没有找到您要查找的节点\n");
        }
    }
#endif
  link_free(&head);
}
