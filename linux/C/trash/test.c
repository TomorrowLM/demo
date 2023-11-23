#include <stdio.h>
#include <stdlib.h>

typedef struct student
{
	int id;
	char name[20];
	struct student *next;
} STU;

// 链表的创建
void link_create(STU **head, STU *obj)
{
	STU *p_mov = *head;
	int id = 1;

	if (*head == NULL)
	{
		*head = obj;
		obj->next = NULL;
	}
	else
	{
		while (p_mov->next != NULL)
		{
			p_mov = p_mov->next; // 找到原有链表的最后一个节点
		}

		p_mov->next = obj; // 将新申请的节点加入链表
		obj->next = NULL;
	}
	id++;
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
		printf("id=%d name=%s \n", p_mov->id, p_mov->name);
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
STU *link_search_num(STU *head, int id)
{
	STU *p_mov;
	// 定义的指针变量保存第一个结点的地址
	p_mov = head;
	// 当没有到达最后一个结点的指针域时循环继续
	while (p_mov != NULL)
	{
		// 如果找到是当前结点的数据，则返回当前结点的地址
		if (p_mov->id == id) // 找到了
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

// 链表结点的删除
void link_delete_id(STU **p_head, int id)
{
	STU *pb, *pf;
	pb = pf = *p_head;
	if (*p_head == NULL) // 链表为空，不用删
	{
		printf("链表为空，没有您要删的节点");
		return;
	}
	while (pb->id != id && pb->next != NULL) // 循环找，要删除的节点
	{
		pf = pb;
		pb = pb->next;
	}
	if (pb->id == id) // 找到了一个节点的num和num相同
	{
		if (pb == *p_head) // 要删除的节点是头节点
		{
			// 让保存头结点的指针保存后一个结点的地址
			*p_head = pb->next;
		}
		else
		{
			// 前一个结点的指针域保存要删除的后一个结点的地址
			pf->next = pb->next;
		}

		// 释放空间
		free(pb);
		pb = NULL;
	}
	else // 没有找到
	{
		printf("没有您要删除的节点\n");
	}
}

// 链表的插入：按照学号的顺序插入
void link_insert_num(STU **p_head, STU *p_new)
{
	STU *pb, *pf;
	pb = pf = *p_head;
	if (*p_head == NULL) // 链表为空链表
	{
		*p_head = p_new;
		p_new->next = NULL;
		return;
	}
	while ((p_new->id >= pb->id) && (pb->next != NULL))
	{
		pf = pb;
		pb = pb->next;
	}

	if (p_new->id < pb->id) // 找到一个节点的num比新来的节点num大，插在pb的前面
	{
		if (pb == *p_head) // 找到的节点是头节点，插在最前面
		{
			p_new->next = *p_head;
			*p_head = p_new;
		}
		else
		{
			pf->next = p_new;
			p_new->next = pb;
		}
	}
	else // 没有找到pb的num比p_new->num大的节点，插在最后
	{
		pb->next = p_new;
		p_new->next = NULL;
	}
}

// 链表的排序
void link_order(STU *head)
{
	STU *pb, *pf, temp;
	pf = head;

	if (head == NULL)
	{
		printf("链表为空,不用排序\n");
		return;
	}

	if (head->next == NULL)
	{
		printf("只有一个节点，不用排序\n");
		return;
	}

	while (pf->next != NULL) // 以pf指向的节点为基准节点，
	{
		pb = pf->next; // pb从基准元素的下个元素开始
		while (pb != NULL)
		{
			if (pf->id > pb->id)
			{
				temp = *pb;
				*pb = *pf;
				*pf = temp;

				temp.next = pb->next;
				pb->next = pf->next;
				pf->next = temp.next;
			}
			pb = pb->next;
		}
		pf = pf->next;
	}
}

// 链表逆序
STU *link_reverse(STU *head)
{
	STU *pf, *pb, *r;
	pf = head;
	pb = pf->next;

	while (pb != NULL)
	{
		r = pb->next;
		pb->next = pf;
		pf = pb;
		pb = r;
	}
	head->next = NULL;
	head = pf;
	return head;
}

void main()
{
	STU *head = NULL, *obj = NULL;
	printf("请输入链表数量");
	int num, i;
	scanf("%d", &num);
	for (i = 0; i < num; i++)
	{
		obj = (STU *)malloc(sizeof(STU));
		// 给新节点赋值
		printf("请输入学号、分数、名字:\n"); // 给新节点赋值
		scanf("%d %s", &obj->id, &obj->name);
		link_create(&head, obj);
	};
	link_print(head);
	// link_free(&first);

// 删除
#if 0
	int id;
	printf("请输入删除id：\n");
	scanf("%d", &id);
	link_delete_id(&head, id);
	link_print(head);
#endif

// 查id
#if 0
	STU *pb;
	int id;
	while (1)
	{
		printf("请输入您要查找学生的学号\n");
		scanf("%d", &id);
		pb = link_search_num(head, id);
		if (pb != NULL) // 找到了
		{
			printf("找到了 id=%d name:%s\n", pb->id, pb->name);
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
}