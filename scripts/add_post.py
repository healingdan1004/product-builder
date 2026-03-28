# /// script
# dependencies = [
#   "markdown",
# ]
# ///

import os
import sys
import datetime
import markdown
import re

# 설정
BLOG_DIR = "blog"
ASSETS_DIR = "assets/blog"
TEMPLATE_PATH = os.path.join(BLOG_DIR, "template.html")
INDEX_PATH = "index.html"
MAIN_JS_PATH = "main.js"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9가-힣]', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text

def add_post():
    print("--- 새로운 블로그 포스트를 생성합니다 ---")
    
    title_ko = input("포스트 제목 (한글): ").strip()
    title_en = input("포스트 제목 (영문): ").strip()
    
    excerpt_ko = input("요약문 (한글): ").strip()
    excerpt_en = input("요약문 (영문): ").strip()
    
    image_name = input("이미지 파일명 (assets/blog/ 내 파일명, 없으면 엔터): ").strip()
    
    # 1. 파일명(Slug) 결정 (본문 입력 전에 받아야 EOF 오류를 방지함)
    slug = input(f"파일명 (기본값: {slugify(title_en) or 'new-post'}): ").strip()
    if not slug:
        slug = slugify(title_en) or "new-post"
    file_path = os.path.join(BLOG_DIR, f"{slug}.html")

    print("\n본문 내용을 입력하세요 (Markdown 형식 지원). 입력이 끝나면 Ctrl+D (Unix) 또는 Ctrl+Z (Windows) 후 엔터를 누르세요:")
    content_md = sys.stdin.read().strip()
    
    if not title_ko or not content_md:
        print("에러: 제목과 본문은 필수입니다.")
        return

    # 2. Markdown -> HTML 변환
    content_html = markdown.markdown(content_md, extensions=['extra', 'nl2br'])

    # 3. 템플릿 채우기
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    image_tag = ""
    if image_name:
        image_tag = f'<img src="../assets/blog/{image_name}" alt="{title_ko}" class="post-hero-img">'

    date_str = datetime.date.today().strftime("%Y년 %m월 %d일")
    
    final_html = template.replace("{{title}}", title_ko) \
                         .replace("{{date}}", date_str) \
                         .replace("{{author}}", "LottoGen 관리자") \
                         .replace("{{content}}", content_html) \
                         .replace("{{image_tag}}", image_tag)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(final_html)
    
    print(f"\n[성공] 새 포스트가 생성되었습니다: {file_path}")

    # 4. index.html 업데이트 (메인 페이지에 노출)
    update_index(slug, title_ko, excerpt_ko)

    # 5. main.js 업데이트 (번역 데이터 추가)
    update_main_js(slug, title_ko, title_en, excerpt_ko, excerpt_en)

def update_index(slug, title_ko, excerpt_ko):
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # 블로그 그리드 섹션 찾기
    blog_grid_pattern = r'(<div class="blog-grid">)'
    new_article = f"""
                    <article class="blog-preview">
                        <h4 data-i18n="blog-{slug}-title">{title_ko}</h4>
                        <p data-i18n="blog-{slug}-excerpt">{excerpt_ko}</p>
                        <a href="blog/{slug}.html" class="read-more" data-i18n="blog-read-more">더 읽어보기</a>
                    </article>"""
    
    if f'blog/{slug}.html' in content:
        print("[주의] index.html에 이미 동일한 경로가 존재하여 추가를 건너뜁니다.")
        return

    updated_content = re.sub(blog_grid_pattern, r'\1' + new_article, content)
    
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print("[성공] index.html에 새 포스트 링크를 추가했습니다.")

def update_main_js(slug, title_ko, title_en, excerpt_ko, excerpt_en):
    with open(MAIN_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # 한국어 번역 추가
    ko_marker = r"(ko: \{)"
    ko_entry = f"\n        'blog-{slug}-title': '{title_ko}', 'blog-{slug}-excerpt': '{excerpt_ko}',"
    content = re.sub(ko_marker, r'\1' + ko_entry, content)

    # 영어 번역 추가
    en_marker = r"(en: \{)"
    en_entry = f"\n        'blog-{slug}-title': '{title_en}', 'blog-{slug}-excerpt': '{excerpt_en}',"
    content = re.sub(en_marker, r'\1' + en_entry, content)

    with open(MAIN_JS_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("[성공] main.js에 번역 데이터를 수록했습니다.")

if __name__ == "__main__":
    add_post()
