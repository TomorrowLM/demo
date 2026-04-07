typedef struct
// 查找表的数据结构（顺序表）
{
  int *elem; // 动态数组基址
  int TableLen;
  // 表的长度
} SSTable;

//  折半查找
int Binary_Search(SSTable L, int key)
{
  int low = 0, high = L.TableLen - 1, mid;
  while (low <= high)
  {
    mid = (low + high) / 2;
    if (L.elem[mid] == key)
      // 取中间位置
      return mid;
    // 查找成功则返回所在位置
    else if (L.elem[mid] > key)
      high = mid - 1; // 从前半部分继续查找
    else
      low = mid + 1;
  }
  // 从后半部分继续查找
  return -1;
  // 查找失败,返回-1
}