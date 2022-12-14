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

//����Ĳ��룺����ѧ�ŵ�˳�����
void link_insert_num(STU **p_head,STU *p_new)
{
    STU *pb,*pf;
    pb=pf=*p_head;
    if(*p_head ==NULL)// ����Ϊ������
    {
        *p_head = p_new;
        p_new->next=NULL;
        return ;
    }
    while((p_new->num >= pb->num)  && (pb->next !=NULL) )
    {
        pf=pb;
        pb=pb->next;
    }

    if(p_new->num < pb->num)//�ҵ�һ���ڵ��num�������Ľڵ�num�󣬲���pb��ǰ��
    {
        if(pb== *p_head)//�ҵ��Ľڵ���ͷ�ڵ㣬������ǰ��
        {
            p_new->next= *p_head;
            *p_head =p_new;
        }
        else
        {
            pf->next=p_new;
            p_new->next = pb;
        }
    }
    else//û���ҵ�pb��num��p_new->num��Ľڵ㣬�������
    {
        pb->next =p_new;
        p_new->next =NULL;
    }
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

    while(1)
    {
        printf("��������Ҫ����Ľڵ�� num score name\n");
        p_new=(STU*)malloc(sizeof(STU));//����һ���½ڵ�
        scanf("%d %d %s",&p_new->num,&p_new->score,p_new->name);
        link_insert_num(&head,p_new);
        link_print(head);
    }

    link_free(&head);
}
