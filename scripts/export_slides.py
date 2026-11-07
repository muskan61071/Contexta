import os
import fitz  # PyMuPDF
from pptx import Presentation

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
pdf_path = os.path.join(base_dir, "Contexta_Project_Presentation.pdf")
pptx_path = os.path.join(base_dir, "Contexta_Project_Presentation.pptx")

slides_dir_pub = os.path.join(base_dir, "client", "public", "slides")
slides_dir_dist = os.path.join(base_dir, "client", "dist", "slides")
os.makedirs(slides_dir_pub, exist_ok=True)
os.makedirs(slides_dir_dist, exist_ok=True)

# 1. Extract speaker notes from PPTX
prs = Presentation(pptx_path)
speaker_notes = []
for idx, slide in enumerate(prs.slides):
    notes = ""
    if slide.has_notes_slide:
        notes_frame = slide.notes_slide.notes_text_frame
        if notes_frame:
            notes = notes_frame.text.strip()
    speaker_notes.append(notes)

# 2. Render PDF pages as crisp images (2x resolution / 150 DPI)
doc = fitz.open(pdf_path)
num_pages = len(doc)
print(f"Total slides found in PDF: {num_pages}")

matrix = fitz.Matrix(2.0, 2.0)  # 2x zoom for sharp presentation quality
slide_data = []

for i in range(num_pages):
    page = doc[i]
    pix = page.get_pixmap(matrix=matrix)
    img_name = f"slide_{i+1:02d}.png"
    
    out_pub = os.path.join(slides_dir_pub, img_name)
    pix.save(out_pub)
    
    out_dist = os.path.join(slides_dir_dist, img_name)
    pix.save(out_dist)
    
    notes = speaker_notes[i] if i < len(speaker_notes) else ""
    slide_data.append({
        "num": i + 1,
        "image": f"/slides/{img_name}",
        "notes": notes
    })
    print(f"Rendered slide {i+1} -> {img_name}")

# 3. Create interactive HTML PowerPoint Slideshow Web App
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contexta - Academic Project Presentation Slideshow</title>
  <style>
    :root {{
      --bg: #070d19;
      --panel: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --primary: #0077b6;
      --accent: #48cae4;
      --mint: #06d6a0;
      --text: #f8fafc;
      --muted: #94a3b8;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }}
    body {{
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }}
    header {{
      background: var(--panel);
      border-bottom: 1px solid var(--border);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }}
    .header-left {{
      display: flex;
      align-items: center;
      gap: 1rem;
    }}
    .brand-badge {{
      background: rgba(72, 202, 228, 0.15);
      border: 1px solid var(--accent);
      color: var(--accent);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .proj-title {{
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
    }}
    .header-actions {{
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}
    .btn {{
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      transition: all 0.15s;
    }}
    .btn:hover {{
      border-color: var(--accent);
      color: #ffffff;
    }}
    .btn-primary {{
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #ffffff;
      border: none;
    }}
    .btn-primary:hover {{
      opacity: 0.9;
    }}

    /* Main Stage */
    .stage-container {{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }}
    .slide-wrapper {{
      position: relative;
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .slide-img {{
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }}
    .nav-arrow {{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 10;
      user-select: none;
    }}
    .nav-arrow:hover {{
      background: var(--accent);
      color: #0b132b;
      transform: translateY(-50%) scale(1.08);
    }}
    .nav-prev {{ left: 16px; }}
    .nav-next {{ right: 16px; }}

    /* Controls Bar */
    .controls-bar {{
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1100px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.6rem 1.25rem;
    }}
    .slide-counter {{
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--accent);
    }}
    .shortcut-hints {{
      font-size: 0.8rem;
      color: var(--muted);
    }}
    .shortcut-hints kbd {{
      background: var(--card);
      border: 1px solid var(--border);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.75rem;
      color: #ffffff;
    }}

    /* Speaker Notes Card */
    .notes-card {{
      margin-top: 1rem;
      width: 100%;
      max-width: 1100px;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1.25rem;
    }}
    .notes-head {{
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.6rem;
      color: var(--mint);
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .notes-content {{
      font-size: 0.9rem;
      color: #e2e8f0;
      line-height: 1.6;
      white-space: pre-line;
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 6px;
      border-left: 3px solid var(--mint);
    }}

    /* Thumbnails Row */
    .thumbnails-row {{
      margin-top: 1.5rem;
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      max-width: 1100px;
      width: 100%;
      padding: 0.5rem 0 1rem 0;
    }}
    .thumb-item {{
      flex: 0 0 120px;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      opacity: 0.6;
      transition: all 0.2s;
    }}
    .thumb-item:hover {{
      opacity: 0.9;
      border-color: var(--border);
    }}
    .thumb-item.active {{
      border-color: var(--accent);
      opacity: 1;
      box-shadow: 0 0 15px rgba(72, 202, 228, 0.4);
    }}
    .thumb-item img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }}
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <span class="brand-badge">PowerPoint Mode</span>
      <span class="proj-title">Contexta: Academic Project Presentation</span>
    </div>
    <div class="header-actions">
      <button class="btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
      <a href="/Contexta_Project_Presentation.pptx" download class="btn">📊 Download .PPTX</a>
      <a href="/Contexta_Project_Presentation.pdf" download class="btn btn-primary">📄 Download PDF</a>
      <a href="/" class="btn">← Back to App</a>
    </div>
  </header>

  <div class="stage-container">
    <!-- Slide Screen -->
    <div class="slide-wrapper" id="slideStage">
      <div class="nav-arrow nav-prev" onclick="prevSlide()">‹</div>
      <img id="currentSlideImg" class="slide-img" src="" alt="Slide view" />
      <div class="nav-arrow nav-next" onclick="nextSlide()">›</div>
    </div>

    <!-- Controls -->
    <div class="controls-bar">
      <div class="slide-counter" id="slideCounter">Slide 1 of {num_pages}</div>
      <div class="shortcut-hints">
        Use <kbd>←</kbd> <kbd>→</kbd> arrow keys, <kbd>Space</kbd>, or click arrows to navigate. Press <kbd>F</kbd> for fullscreen.
      </div>
    </div>

    <!-- Speaker Notes & Viva Defense Points -->
    <div class="notes-card">
      <div class="notes-head">
        <span>💡 Presentation & Viva Talking Points (For Teachers & Evaluators)</span>
      </div>
      <div class="notes-content" id="speakerNotes"></div>
    </div>

    <!-- Thumbnails Scroller -->
    <div class="thumbnails-row" id="thumbsRow"></div>
  </div>

  <script>
    const slides = {slide_data};
    let currentIndex = 0;

    const imgEl = document.getElementById('currentSlideImg');
    const counterEl = document.getElementById('slideCounter');
    const notesEl = document.getElementById('speakerNotes');
    const thumbsRow = document.getElementById('thumbsRow');

    function init() {{
      // Render thumbnails
      slides.forEach((s, idx) => {{
        const thumb = document.createElement('div');
        thumb.className = `thumb-item ${{idx === 0 ? 'active' : ''}}`;
        thumb.id = `thumb-${{idx}}`;
        thumb.innerHTML = `<img src="${{s.image}}" alt="Slide ${{s.num}}" />`;
        thumb.onclick = () => goToSlide(idx);
        thumbsRow.appendChild(thumb);
      }});
      updateView();
    }}

    function updateView() {{
      const current = slides[currentIndex];
      imgEl.src = current.image;
      counterEl.textContent = `Slide ${{current.num}} of ${{slides.length}}`;
      notesEl.textContent = current.notes || "Ready for presentation. Explain the slide content clearly to the examiners.";

      // Update active thumbnail
      document.querySelectorAll('.thumb-item').forEach((el, idx) => {{
        el.classList.toggle('active', idx === currentIndex);
      }});

      // Auto-scroll active thumbnail into view
      const activeThumb = document.getElementById(`thumb-${{currentIndex}}`);
      if (activeThumb) {{
        activeThumb.scrollIntoView({{ behavior: 'smooth', block: 'nearest', inline: 'center' }});
      }}
    }}

    function nextSlide() {{
      if (currentIndex < slides.length - 1) {{
        currentIndex++;
        updateView();
      }}
    }}

    function prevSlide() {{
      if (currentIndex > 0) {{
        currentIndex--;
        updateView();
      }}
    }}

    function goToSlide(idx) {{
      currentIndex = idx;
      updateView();
    }}

    function toggleFullscreen() {{
      const stage = document.getElementById('slideStage');
      if (!document.fullscreenElement) {{
        stage.requestFullscreen().catch(err => alert(err.message));
      }} else {{
        document.exitFullscreen();
      }}
    }}

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {{
        e.preventDefault();
        nextSlide();
      }} else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {{
        e.preventDefault();
        prevSlide();
      }} else if (e.key.toLowerCase() === 'f') {{
        e.preventDefault();
        toggleFullscreen();
      }}
    }});

    window.onload = init;
  </script>
</body>
</html>
"""

# Save to public and dist
out_html_pub = os.path.join(base_dir, "client", "public", "presentation.html")
with open(out_html_pub, "w", encoding="utf-8") as f:
    f.write(html_content)

out_html_dist = os.path.join(base_dir, "client", "dist", "presentation.html")
with open(out_html_dist, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated presentation slideshow: {out_html_pub}")
