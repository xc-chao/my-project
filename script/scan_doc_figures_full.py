# -*- coding: utf-8 -*-
from pathlib import Path
from docx import Document
p = Path(r'C:\Users\86157\Desktop\2022213244-徐超-毕业论文.docx')
doc = Document(str(p))
needles = ['图', '截图', '流程图', 'E-R', '结构图', '界面图', '状态流转图', '模块图', '时序图', '范围图']
items=[]
for par in doc.paragraphs:
    t=par.text.strip()
    if not t: continue
    if '预留图片位置' in t: continue
    if any(n in t for n in needles):
        items.append(t)
seen=[]
for t in items:
    if t not in seen:
        seen.append(t)
print('\n'.join(seen))
