# -*- coding: utf-8 -*-
from pathlib import Path
from docx import Document
md = Path(r'C:\Users\86157\Desktop\UniAppPencil\毕设文档\画图流程图.md').read_text(encoding='utf-8')
doc = Document(r'C:\Users\86157\Desktop\2022213244-徐超-毕业论文.docx')
figs=[]
for p in doc.paragraphs:
    t=p.text.strip()
    if t.startswith('图') or (t.startswith('【此处插入') and t.endswith('】')):
        if t not in figs:
            figs.append(t)
missing=[]
for t in figs:
    key=t.replace('【此处插入','').replace('】','')
    if key not in md and t not in md:
        missing.append(t)
print('doc_fig_count', len(figs))
print('missing_count', len(missing))
for m in missing:
    print(m)
