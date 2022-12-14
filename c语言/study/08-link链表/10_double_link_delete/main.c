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

//˫�������ɾ��
void double_link_delete_num(STU **p_head,int num)
{
    STU *pb,*pf;
    pb=*p_head;
    if(*p_head==NULL)//����Ϊ�գ�����Ҫɾ��
    {
        printf("����Ϊ�գ�û����Ҫɾ���Ľڵ�\n");
        return ;
    }
    while((pb->num != num) && (pb->next != NULL) )
    {
        pb=pb->next;
    }
    if(pb->num == num)//�ҵ���һ���ڵ��num��num��ͬ��ɾ��pbָ��Ľڵ�
    {
        if(pb == *p_head)//�ҵ��Ľڵ���ͷ�ڵ�
        {
            if((*p_head)->next==NULL)//ֻ��һ���ڵ�����
            {
                *p_head=pb->next;
            }
            else//�ж���ڵ�����
            {
                *p_head = pb->next;//main�����е�headָ���¸��ڵ�
                (*p_head)->front=NULL;
            }
        }
        else//Ҫɾ�Ľڵ��������ڵ�
        {
            if(pb->next!=NULL)//ɾ���м�ڵ�
            {
                pf=pb->front;//��pfָ���ҵ��Ľڵ��ǰһ���ڵ�
                pf->next=pb->next; //ǰһ������next�����һ�����ĵ�ַ
                (pb->next)->front=pf; //��һ������front����ǰһ�����ĵ�ַ
            }
            else//ɾ��β�ڵ�
            {
                pf=pb->front;
                pf->next=NULL;
            }
        }

        free(pb);//�ͷ��ҵ��Ľڵ�

    }
    else//û�ҵ�
    {
        printf("û����Ҫɾ���Ľڵ�\n");
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

    printf("��������Ҫɾ���Ľڵ��num\n");
    scanf("%d",&num);
    double_link_delete_num(&head,num);
    double_link_print(head);

}
