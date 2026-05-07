# -*- coding: utf-8 -*-
from pathlib import Path
from docx import Document
paths = [
    Path(r'C:\Users\86157\Desktop\2022213244-徐超-毕业论文.docx'),
    Path(r'C:\Users\86157\Desktop\UniAppPencil\毕设文档\毕业论文_徐超_格式修正版.docx'),
]
for p in paths:
    print('FILE', p, 'exists=', p.exists())
    if not p.exists():
        continue
    doc = Document(str(p))
    texts = [par.text.strip() for par in doc.paragraphs if par.text.strip()]
    for i, t in enumerate(texts):
        if '预留图片位置' in t or t.startswith('图') or '截图' in t or '流程图' in t or 'E-R' in t or '结构图' in t:
            print(t)
