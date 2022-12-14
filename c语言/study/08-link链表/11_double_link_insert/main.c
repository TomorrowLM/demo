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

//˫������Ĳ���
void double_link_insert_num(STU **p_head,STU *p_new)
{
    STU *pb,*pf;
    pb=*p_head;
    if(*p_head == NULL)//����Ϊ�գ������Ľڵ����ͷ�ڵ�
    {
        *p_head=p_new;
        p_new->front=NULL;
        p_new->next=NULL;
        return ;
    }
    while((p_new->num >= pb->num) && (pb->next!=NULL) )
    {
        pb=pb->next ;
    }
    if(p_new->num < pb->num)//�ҵ���һ��pb��num�������Ľڵ��num�󣬲���pbǰ��
    {
        if(pb==*p_head)//�ҵ��Ľڵ���ͷ�ڵ㣬����ͷ�ڵ��ǰ��
        {
            p_new->next=*p_head; //�²���Ľ���next����֮ǰͷ���ĵ�ַ
            (*p_head)->front=p_new; //֮ǰͷ����front�����²���Ľ��ĵ�ַ
            p_new->front=NULL; //�²���Ľ���front����NULL
            *p_head=p_new; //��ԭ�����������׵�ַ��ָ�뱣���²�����ĵ�ַ
        }
        else
        {
            pf=pb->front;//pfָ�� �ҵ��ڵ��ǰһ���ڵ�

            p_new->next=pb;
            p_new->front=pf;
            pf->next=p_new;
            pb->front=p_new;
        }
    }
    else//����pbָ��ڵ��num����p_newָ��Ľڵ��numС���������
    {
        pb->next=p_new;
        p_new->front=pb;
        p_new->next=NULL;
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

    printf("************************\n");

    while(1)
    {
        p_new=(STU*)malloc(sizeof(STU));//����һ���½ڵ�
        printf("��������Ҫ����Ľڵ��num score name\n");
        scanf("%d %d %s",&p_new->num,&p_new->score,p_new->name);
        double_link_insert_num(&head,p_new);
        double_link_print(head);

    }
}
