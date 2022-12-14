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
    struct student *next;
}STU;

void link_creat_head(STU **p_head,STU *p_new)
{
    STU *p_mov = *p_head;
    if(*p_head == NULL)	//����һ�μ�������Ϊ��ʱ��headִ��p_new
    {
        *p_head = p_new;
        p_new->next=NULL;
    }
    else //�ڶ��μ��Ժ��������
    {
        while(p_mov->next!=NULL)
        {
            p_mov=p_mov->next;	//�ҵ�ԭ����������һ���ڵ�
        }

        p_mov->next = p_new;	//��������Ľڵ��������
        p_new->next = NULL;
    }
}

//����ı���
void link_print(STU *head)
{
    STU *p_mov;
    //�����µ�ָ�뱣��������׵�ַ����ֹʹ��head�ı�ԭ������
    p_mov = head;
    //��ָ�뱣�����һ������ָ����ΪNULLʱ��ѭ������
    while(p_mov!=NULL)
    {
        //�ȴ�ӡ��ǰָ�뱣�����ָ����
        printf("num=%d score=%d name:%s\n",p_mov->num,\
               p_mov->score,p_mov->name);

        //ָ����ƣ�������һ�����ĵ�ַ
        p_mov = p_mov->next;
    }
}

//������ͷ�
void link_free(STU **p_head)
{
    //����һ��ָ���������ͷ���ĵ�ַ
    STU *pb=*p_head;

    while(*p_head!=NULL)
    {
        //�ȱ���p_headָ��Ľ��ĵ�ַ
        pb=*p_head;
        //p_head������һ������ַ
        *p_head=(*p_head)->next;
        //�ͷŽ�㲢��ֹҰָ��
        free(pb);
        pb = NULL;
    }
}

//��������
STU *link_reverse(STU *head)
{
    STU *pf,*pb,*r;
    pf=head;
    pb=pf->next;

    while(pb!=NULL)
    {
        r=pb->next;
        pb->next=pf;
        pf=pb;
        pb=r;
    }
    head->next=NULL;
    head=pf;
    return head;
}

int main()
{
    STU *head = NULL,*p_new = NULL;
    int num,i;
    printf("�����������ʼ����:\n");
    scanf("%d",&num);
    for(i = 0; i < num;i++)
    {
        p_new = (STU*)malloc(sizeof(STU));//����һ���½ڵ�
        printf("������ѧ�š�����������:\n"); //���½ڵ㸳ֵ
        scanf("%d %d %s",&p_new->num,&p_new->score,p_new->name);

        link_creat_head(&head,p_new);	//���½ڵ��������
    }

    link_print(head);

    printf("***********************\n");

    head = link_reverse(head);

    link_print(head);

    link_free(&head);
}
