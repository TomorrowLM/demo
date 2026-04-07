#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
// 定义结点结构
typedef struct Node
{
  char data;
  int Ltag, Rtag;
  struct Node *LChild;
  struct Node *RChild;
} BiTreeNode, *BiThrTree;
// 建立二叉链表
void Establish(BiThrTree *tree, char parentName)
{
  *tree = (BiTreeNode *)malloc(sizeof(BiTreeNode));
  char data;
  scanf("%c", &data);
  getchar();
  if (data == ' ')
  {
    *tree = NULL;
    return;
  }
  (*tree)->data = data;
  (*tree)->LChild = NULL;
  (*tree)->RChild = NULL;
  (*tree)->Ltag = 0;
  (*tree)->Rtag = 0;
  printf("请输入%c左孩子：\n", data);
  Establish(&((*tree)->LChild), data);
  printf("请输入%c右孩子：\n", data);
  Establish(&((*tree)->RChild), data);
}

void before_thread(BiThrTree *root)
{
  static BiThrTree pre = NULL; // 在递归调用中，初始化pre，且保存每次pre的信息，用static静态局部变量解决

  if ((*root) == NULL)
    return;
  if ((*root)->LChild == NULL) // 当前结点的左子树为空
  {
    (*root)->LChild = pre; //  第一步   置前驱线索
    (*root)->Ltag = 1;     // 左标志域为1
  }
  if (pre != NULL && pre->RChild == NULL) // 刚刚访问的结点不为空且右子树为空
  {
    pre->RChild = (*root); //  第二步 置后驱线索
    pre->Rtag = 1;         // 右标志域为1
  }
  pre = (*root); //  第三步  pre指向当前访问的结点
  // 如果不判断就会造成死循环,因为在程序一开始就对其左右孩子为NULL时就做了前驱后继的处理，
  // 同时改了标志位，所以此处可根据标志位判断是子树还是前驱后继
  if ((*root)->Ltag == 0)
    before_thread(&(*root)->LChild); // 通过递归线索化左子树

  if ((*root)->Rtag == 0)
    before_thread(&(*root)->RChild); // 递归线索化右子树
}
// 中序线索化，建立线索链表
void in_thread(BiThrTree *root)
{
  static BiThrTree pre = NULL; // 在递归调用中，初始化pre，且保存每次pre的信息，用static静态局部变量解决
  if (*root == NULL)
  {
    return;
  }
  in_thread(&((*root)->LChild)); // 通过递归线索化左子树
  if ((*root)->LChild == NULL)   // 当前结点的左子树为空
  {
    (*root)->LChild = pre; //  第一步   置前驱线索
    (*root)->Ltag = 1;     // 左标志域为1
  }
  if (pre != NULL && pre->RChild == NULL) // 刚刚访问的结点不为空且右子树为空
  {
    pre->RChild = (*root); //  第二步 置后驱线索
    pre->Rtag = 1;         // 右标志域为1
  }
  pre = (*root);                 //  第三步  pre指向当前访问的结点
  in_thread(&((*root)->RChild)); // 递归线索化右子树
}

void after_thread(BiThrTree *root)
{
  static BiThrTree pre = NULL; // 在递归调用中，初始化pre，且保存每次pre的信息，用static静态局部变量解决
  if (*root == NULL)
  {
    return;
  }
  after_thread(&((*root)->LChild)); // 通过递归线索化左子树
  after_thread(&((*root)->RChild)); // 递归线索化右子树
  if ((*root)->LChild == NULL)      // 当前结点的左子树为空
  {
    (*root)->LChild = pre; //  第一步   置前驱线索
    (*root)->Ltag = 1;     // 左标志域为1
  }
  if (pre != NULL && pre->RChild == NULL) // 刚刚访问的结点不为空且右子树为空
  {
    pre->RChild = (*root); //  第二步 置后驱线索
    pre->Rtag = 1;         // 右标志域为1
  }
  pre = (*root); //  第三步  pre指向当前访问的结点
}

// 查找遍历的首结点
BiThrTree InFirst(BiThrTree root)
{
  BiThrTree p = root;
  if (p == NULL)
    return NULL;
  while (p->Ltag == 0)
    p = p->LChild;
  return p;
}
// 查找遍历过程中结点的直接后继
BiThrTree InNext(BiThrTree p)
{
  BiThrTree next = NULL;
  if (p->Rtag == 1)
    next = p->RChild;
  else
  {
    next = p->RChild;
    while (next != NULL && next->Ltag == 0) // next!=NULL,解决局部变量next为空指针时，不能访问data等数据
      next = next->LChild;
  }
  return next;
}
// 遍历线索二叉树
void TinOrder(BiThrTree root)
{
  BiThrTree p;
  if (root == NULL)
    return;
  // TODO
  p = root; // 前序
  // p = InFirst(root); // 中序
  while (p != NULL)
  {
    printf("%c ", p->data);
    p = InNext(p);
  }
}

void main()
{
  SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
  BiThrTree root;
  printf("------根据二叉链表的格式输入结点数据------\n");
  Establish(&root, 'a');
  printf("线索化，建立线索链表\n");
  before_thread(&root);
  printf("-------遍历打印线索二叉树-------\n");
  printf("\n");
  TinOrder(root);
}