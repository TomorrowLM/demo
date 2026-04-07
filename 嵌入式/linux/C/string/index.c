#include "./index.h"

void main()
{
    SetConsoleOutputCP(65001); // 中文输出变成乱码 (STU *)malloc(sizeof(STU))
    SString stringIndex;
    printf("====subString\n");
    stringIndex.length = sizeof(stringIndex.ch);
    strcpy(stringIndex.ch, "I love you");
    stringIndex.length = subLength(stringIndex);
    printf("%s\n", stringIndex.ch);
    printf("%c\n", stringIndex.ch[11]);
    printf("%d\n", stringIndex.length);
    SString *sub;
    sub = (SString *)malloc(sizeof(SString));
    sub->length = 0;
    subString(&sub, stringIndex, 3, 2);
    printf("%s\n", sub->ch);
    printf("%c\n", sub->ch[0]);
    printf("%c\n", sub->ch[1]);
    printf("%c\n", sub->ch[2]);
    printf("%c\n", sub->ch[3]);
    printf("====subCompare\n");
    SString s1 = {ch : "ased", length : 3};
    SString s2 = {ch : "asrd", length : 4};
    printf("%d\n", subCompare(s1, s2));
}
