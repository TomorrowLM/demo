#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

typedef struct BiTNode
{
  char data;
  struct BiTNode *LChild, *RChild;
} BiTNode, *BiTree;

void create_BiTree(BiTree *tree, char parentName)
{
  // BiTree tree = *T;
  // printf("%p\n", *tree);
  *tree = (BiTNode *)malloc(sizeof(BiTNode));
  // printf("%p\n", *tree);
  char data;
  scanf("%c", &data);
  getchar();
  printf("parentName:%c\n", parentName);
  (*tree)->data = data;
  (*tree)->LChild = NULL;
  (*tree)->RChild = NULL;
  if (data != ' ')
  {
    printf("请输入%c左孩子：\n", data);
    create_BiTree(&((*tree)->LChild), data);
    printf("请输入%c右孩子：\n", data);
    create_BiTree(&((*tree)->RChild), data);
  }
  else
  {
    *tree = NULL;
    return;
  }
}

void _PrintTree_f1(BiTree tree)
{
  if (tree) //*如果a不为空
  {
    printf("%c\n", tree->data);  //*访问根结点
    _PrintTree_f1(tree->LChild); //*遍历左子树
    _PrintTree_f1(tree->RChild); //*遍历右子树
  }
  else
  {
    printf("null\n");
  }
}

void _PrintTree_f2(BiTree tree)
{
  if (tree) //*如果a不为空
  {
    _PrintTree_f2(tree->LChild); //*遍历左子树
    printf("%c\n", tree->data);  //*访问根结点
    _PrintTree_f2(tree->RChild); //*遍历右子树
  }
}

void _PrintTree_f3(BiTree tree)
{
  if (tree) //*如果a不为空
  {
    _PrintTree_f3(tree->LChild); //*遍历左子树
    _PrintTree_f3(tree->RChild); //*遍历右子树
    printf("%c\n", tree->data);  //*访问根结点
  }
}

void Delete_Tree(BiTree *tree)
{
  if (*tree)
  {
    Delete_Tree(&(*tree)->LChild);
    Delete_Tree(&(*tree)->RChild);
    BiTree b;
    b = *tree;
    free(b);
  }
}

int main(void)
{
  SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
  BiTree T;
  create_BiTree(&T, 'a');
  printf("%p\n", T);
  printf("%c\n", T->data); //*访问根结点
  printf("前序遍历：\n");
  _PrintTree_f1(T);
  printf("中序遍历：\n");
  _PrintTree_f2(T);
  printf("后序遍历：\n");
  _PrintTree_f3(T);
  Delete_Tree(&T);
  return 0;
}
