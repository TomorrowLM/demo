#include "./index.h"

int main()
{
    SetConsoleOutputCP(65001); // 中文输出变成乱码
    // STU *head = (STU *)malloc(sizeof(STU));
    STUList head = NULL, p_new = NULL;
    int num, i;
    printf("请输入链表初始个数:\n");
    scanf("%d", &num);
    for (i = 0; i < num; i++) 
    {
        p_new = (STU *)malloc(sizeof(STU));  // 申请一个新节点
        printf("请输入学号、分数、名字:\n"); // 给新节点赋值
        scanf("%d %d %s", &p_new->num, &p_new->score, &p_new->name);
        printf("%p\n", head);
        printf("%p\n", &head);
        link_creat_head(&head, p_new); // 将新节点加入链表,&head二级指针
        printf("%p\n", head);
        printf("%p\n", *head);
        printf("id=%d\n", head->num);
    }

    // printf("id=%d id=%d name=%s\n", head->num, head->next->num, head->next->name);
    // link_print(head);
}
