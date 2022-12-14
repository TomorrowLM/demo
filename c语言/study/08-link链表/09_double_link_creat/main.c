#include <stdio.h>
#include <stdlib.h>

//������ṹ��
typedef struct student
{
    //������
    int num;		//ѧ��
    int score;      //����
    char name[20];  //����

    //ָ����
    struct student *front;  //������һ�����ĵ�ַ
    struct student *next;   //������һ�����ĵ�ַ
}STU;

void double_link_creat_head(STU **p_head,STU *p_new)
{
    STU *p_mov=*p_head;
    if(*p_head==NULL)				//����һ�μ�������Ϊ��ʱ��headִ��p_new
    {
        *p_head = p_new;
        p_new->front = NULL;
        p_new->next = NULL;
    }
    else	//�ڶ��μ��Ժ��������
    {
        while(p_mov->next!=NULL)
        {
            p_mov=p_mov->next;	//�ҵ�ԭ����������һ���ڵ�
        }
        p_mov->next = p_new;		//��������Ľڵ��������
        p_new->front = p_mov;
        p_new->next = NULL;
    }
}


void double_link_print(STU *head)
{
    STU *pb;
    pb=head;
    while(pb->next!=NULL)
    {
        printf("num=%d score=%d name:%s\n",pb->num,pb->score,pb->name);
        pb=pb->next;
    }
    printf("num=%d score=%d name:%s\n",pb->num,pb->score,pb->name);

    printf("***********************\n");

    while(pb!=NULL)
    {
        printf("num=%d score=%d name:%s\n",pb->num,pb->score,pb->name);
        pb=pb->front;
    }
}

int main()
{
    STU *head=NULL,*p_new=NULL;
    int num,i;
    printf("�����������ʼ����:\n");
    scanf("%d",&num);
    for(i=0;i<num;i++)
    {
        p_new=(STU*)malloc(sizeof(STU));//����һ���½ڵ�
        printf("������ѧ�š�����������:\n");	//���½ڵ㸳ֵ
        scanf("%d %d %s",&p_new->num,&p_new->score,p_new->name);
        double_link_creat_head(&head,p_new);	//���½ڵ��������
    }

    double_link_print(head);
}
