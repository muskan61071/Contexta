"""
Generates high-resolution academic system diagrams for the Contexta Project Report and Presentation:
1. System Architecture Diagram (Client -> Gateway -> NLP Engine -> SQLite)
2. UML Use Case Diagram
3. Data Flow Diagram Level 0 (Context Diagram)
4. Data Flow Diagram Level 1 (System Decomposition)
5. Data Flow Diagram Level 2 (NLP Ambiguity Pipeline)
6. System Flowchart (Process Flow)
7. Entity-Relationship (ER) Diagram
8. UI Interface Diagram (Conversation Analyzer with Left Sidebar)
9. NLP Results Breakdown Diagram (Risk, Rewrite, Ambiguity, Evidence, Clarification)
"""

import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Color Palette (Modern Tech Theme)
BG_COLOR = (17, 21, 35)         # Deep slate navy
PANEL_COLOR = (26, 32, 53)      # Card dark
BORDER_COLOR = (45, 55, 85)     # Slate border
TEXT_MAIN = (241, 245, 249)     # White / light slate
TEXT_MUTED = (148, 163, 184)    # Gray slate
PRIMARY = (99, 102, 241)        # Indigo
SUCCESS = (16, 185, 129)        # Emerald
WARNING = (245, 158, 11)        # Amber
ACCENT_CYAN = (6, 182, 212)     # Cyan
ACCENT_PURPLE = (168, 85, 247)  # Purple
CARD_BG = (22, 27, 44)

def get_font(size=14, bold=False):
    # Try common Windows TrueType fonts, fallback to default
    font_names = ["segoeui.ttf", "arial.ttf", "tahoma.ttf"]
    if bold:
        font_names = ["segoeuib.ttf", "arialbd.ttf", "tahomabd.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(f"C:\\Windows\\Fonts\\{fn}", size)
        except Exception:
            pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, box, radius=8, fill=PANEL_COLOR, outline=BORDER_COLOR, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def draw_arrow(draw, start, end, color=PRIMARY, width=2):
    draw.line([start, end], fill=color, width=width)
    x1, y1 = start
    x2, y2 = end
    # Arrowhead
    if x1 == x2: # Vertical
        sign = 1 if y2 > y1 else -1
        draw.polygon([(x2, y2), (x2 - 5, y2 - sign * 8), (x2 + 5, y2 - sign * 8)], fill=color)
    elif y1 == y2: # Horizontal
        sign = 1 if x2 > x1 else -1
        draw.polygon([(x2, y2), (x2 - sign * 8, y2 - 5), (x2 - sign * 8, y2 + 5)], fill=color)

# -------------------------------------------------------------------------
# 1. SYSTEM ARCHITECTURE DIAGRAM
# -------------------------------------------------------------------------
def create_architecture_diagram():
    img = Image.new("RGB", (1000, 520), BG_COLOR)
    draw = ImageDraw.Draw(img)

    f_title = get_font(20, bold=True)
    f_box_title = get_font(15, bold=True)
    f_text = get_font(12, bold=False)
    f_sub = get_font(11, bold=False)

    draw.text((30, 20), "Figure 4.1: Three-Tier System Architecture of Contexta", fill=TEXT_MAIN, font=f_title)
    draw.text((30, 48), "React/Vite Client Layer <-> Express API Gateway <-> FastAPI NLP Engine <-> SQLite History", fill=TEXT_MUTED, font=f_sub)

    # Box 1: Presentation Tier
    draw_rounded_rect(draw, (40, 90, 300, 450), radius=10, fill=CARD_BG, outline=PRIMARY, width=2)
    draw.text((60, 110), "PRESENTATION TIER", fill=PRIMARY, font=f_box_title)
    draw.text((60, 130), "(Vite + React 18 + TypeScript)", fill=TEXT_MUTED, font=f_sub)
    draw_rounded_rect(draw, (55, 160, 285, 210), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((70, 175), "Conversation Analyzer UI", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (55, 225, 285, 275), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((70, 240), "Curated Demo Sidebar", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (55, 290, 285, 340), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((70, 305), "Chat Bubble Renderer", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (55, 355, 285, 405), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((70, 370), "Clarity & Rewrite Breakdown", fill=TEXT_MAIN, font=f_text)

    # Box 2: API Gateway Tier
    draw_rounded_rect(draw, (360, 90, 620, 450), radius=10, fill=CARD_BG, outline=ACCENT_CYAN, width=2)
    draw.text((380, 110), "GATEWAY TIER", fill=ACCENT_CYAN, font=f_box_title)
    draw.text((380, 130), "(Node.js + Express + Zod)", fill=TEXT_MUTED, font=f_sub)
    draw_rounded_rect(draw, (375, 160, 605, 210), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((390, 175), "Schema Validation (Zod)", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (375, 225, 605, 275), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((390, 240), "Route Proxying & Security", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (375, 290, 605, 340), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((390, 305), "Timeout & Bounds Guards", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (375, 355, 605, 405), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((390, 370), "Analysis History API", fill=TEXT_MAIN, font=f_text)

    # Box 3: NLP Engine & Storage Tier
    draw_rounded_rect(draw, (680, 90, 950, 450), radius=10, fill=CARD_BG, outline=SUCCESS, width=2)
    draw.text((700, 110), "NLP & PERSISTENCE TIER", fill=SUCCESS, font=f_box_title)
    draw.text((700, 130), "(FastAPI + Rule Engine + SQLite)", fill=TEXT_MUTED, font=f_sub)
    draw_rounded_rect(draw, (695, 160, 935, 210), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((710, 175), "4-Class Ambiguity Detection", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (695, 225, 935, 275), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((710, 240), "Context Retrieval & Scoring", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (695, 290, 935, 340), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((710, 305), "Risk & Rewrite Generation", fill=TEXT_MAIN, font=f_text)
    draw_rounded_rect(draw, (695, 355, 935, 405), radius=6, fill=PANEL_COLOR, outline=BORDER_COLOR)
    draw.text((710, 370), "SQLite Store (contexta.sqlite3)", fill=TEXT_MAIN, font=f_text)

    # Arrows between tiers
    draw_arrow(draw, (300, 270), (360, 270), color=PRIMARY, width=3)
    draw_arrow(draw, (620, 270), (680, 270), color=ACCENT_CYAN, width=3)

    draw.text((305, 250), "HTTP/JSON", fill=TEXT_MUTED, font=f_sub)
    draw.text((625, 250), "REST API", fill=TEXT_MUTED, font=f_sub)

    out_path = os.path.join(OUTPUT_DIR, "fig1_system_architecture.png")
    img.save(out_path)
    print("Generated:", out_path)

# -------------------------------------------------------------------------
# 2. USE CASE DIAGRAM
# -------------------------------------------------------------------------
def create_use_case_diagram():
    img = Image.new("RGB", (1000, 560), BG_COLOR)
    draw = ImageDraw.Draw(img)

    f_title = get_font(20, bold=True)
    f_actor = get_font(14, bold=True)
    f_uc = get_font(12, bold=False)
    f_sub = get_font(11, bold=False)

    draw.text((30, 20), "Figure 4.2: UML Use Case Diagram of Contexta", fill=TEXT_MAIN, font=f_title)
    draw.text((30, 48), "Primary Actor Interactions with Conversation Ambiguity & Clarity Services", fill=TEXT_MUTED, font=f_sub)

    # Actor: User (left)
    draw.ellipse((85, 180, 115, 210), fill=PANEL_COLOR, outline=PRIMARY, width=2) # Head
    draw.line([(100, 210), (100, 280)], fill=PRIMARY, width=3) # Body
    draw.line([(70, 230), (130, 230)], fill=PRIMARY, width=3) # Arms
    draw.line([(100, 280), (75, 340)], fill=PRIMARY, width=3) # Left Leg
    draw.line([(100, 280), (125, 340)], fill=PRIMARY, width=3) # Right Leg
    draw.text((70, 360), "User / Communicator", fill=TEXT_MAIN, font=f_actor)

    # System Boundary
    draw_rounded_rect(draw, (230, 85, 930, 520), radius=12, fill=CARD_BG, outline=BORDER_COLOR, width=2)
    draw.text((250, 100), "Context-Aware Ambiguity Resolution System Boundary", fill=ACCENT_CYAN, font=get_font(13, bold=True))

    use_cases = [
        ("UC-01: Paste Multi-turn Conversation", (420, 150)),
        ("UC-02: Select Curated Demo Example", (420, 210)),
        ("UC-03: View Chat-Style Message Bubbles", (420, 270)),
        ("UC-04: Run Real-Time Ambiguity Analysis", (420, 330)),
        ("UC-05: Review Miscommunication Risk & Confidence", (420, 390)),
        ("UC-06: Answer Clarification & Copy Clear Rewrite", (420, 450)),
    ]

    actor_pos = (140, 250)
    for name, pos in use_cases:
        bx, by = pos
        draw.ellipse((bx - 140, by - 22, bx + 160, by + 22), fill=PANEL_COLOR, outline=PRIMARY, width=1)
        draw.text((bx - 120, by - 8), name, fill=TEXT_MAIN, font=f_uc)
        # Association line
        draw.line([actor_pos, (bx - 140, by)], fill=TEXT_MUTED, width=1)

    out_path = os.path.join(OUTPUT_DIR, "fig2_use_case_diagram.png")
    img.save(out_path)
    print("Generated:", out_path)

# -------------------------------------------------------------------------
# 3. DATA FLOW DIAGRAMS (LEVEL 0, 1, 2)
# -------------------------------------------------------------------------
def create_dfd_diagrams():
    # DFD Level 0
    img0 = Image.new("RGB", (950, 400), BG_COLOR)
    draw0 = ImageDraw.Draw(img0)
    draw0.text((30, 20), "Figure 4.3: Data Flow Diagram (DFD Level 0) - Context Diagram", fill=TEXT_MAIN, font=get_font(19, bold=True))

    # Entity 1: User
    draw_rounded_rect(draw0, (50, 160, 200, 240), radius=6, fill=PANEL_COLOR, outline=PRIMARY, width=2)
    draw0.text((90, 190), "User / Client", fill=TEXT_MAIN, font=get_font(14, bold=True))

    # Process 0: Contexta System
    draw0.ellipse((380, 130, 580, 270), fill=CARD_BG, outline=SUCCESS, width=2)
    draw0.text((435, 175), "0.0 Contexta", fill=SUCCESS, font=get_font(15, bold=True))
    draw0.text((400, 205), "Ambiguity System", fill=TEXT_MAIN, font=get_font(14, bold=False))

    # Entity 2: SQLite Storage
    draw_rounded_rect(draw0, (760, 160, 910, 240), radius=6, fill=PANEL_COLOR, outline=ACCENT_PURPLE, width=2)
    draw0.text((780, 190), "SQLite Database", fill=TEXT_MAIN, font=get_font(14, bold=True))

    # Flows
    draw_arrow(draw0, (200, 180), (380, 180), color=PRIMARY, width=2)
    draw0.text((220, 160), "Pasted Conversation", fill=TEXT_MUTED, font=get_font(11))

    draw_arrow(draw0, (380, 220), (200, 220), color=PRIMARY, width=2)
    draw0.text((215, 230), "Clarity Report, Risk, Rewrite", fill=TEXT_MUTED, font=get_font(11))

    draw_arrow(draw0, (580, 180), (760, 180), color=SUCCESS, width=2)
    draw0.text((610, 160), "Persist Analysis JSON", fill=TEXT_MUTED, font=get_font(11))

    draw_arrow(draw0, (760, 220), (580, 220), color=SUCCESS, width=2)
    draw0.text((615, 230), "History Query Results", fill=TEXT_MUTED, font=get_font(11))

    out_path0 = os.path.join(OUTPUT_DIR, "fig3_dfd_level0.png")
    img0.save(out_path0)
    print("Generated:", out_path0)

    # DFD Level 1
    img1 = Image.new("RGB", (1000, 520), BG_COLOR)
    draw1 = ImageDraw.Draw(img1)
    draw1.text((30, 20), "Figure 4.4: Data Flow Diagram (DFD Level 1) - Subsystem Decomposition", fill=TEXT_MAIN, font=get_font(19, bold=True))

    processes = [
        ("1.0 Transcript\nNormalization", (160, 160)),
        ("2.0 4-Class Ambiguity\nDetection", (480, 160)),
        ("3.0 Context Retrieval\n& Candidate Ranking", (800, 160)),
        ("4.0 Risk & Rewrite\nGeneration", (800, 380)),
        ("5.0 Clarification\nPrompting", (480, 380)),
        ("6.0 Analysis\nPersistence", (160, 380)),
    ]

    for ptitle, (px, py) in processes:
        draw1.ellipse((px - 90, py - 40, px + 90, py + 40), fill=CARD_BG, outline=ACCENT_CYAN, width=2)
        lines = ptitle.split("\n")
        draw1.text((px - 70, py - 18), lines[0], fill=TEXT_MAIN, font=get_font(12, bold=True))
        draw1.text((px - 70, py + 2), lines[1], fill=TEXT_MUTED, font=get_font(11))

    # Flow lines Level 1
    draw_arrow(draw1, (250, 160), (390, 160), color=PRIMARY, width=2)
    draw_arrow(draw1, (570, 160), (710, 160), color=PRIMARY, width=2)
    draw_arrow(draw1, (800, 200), (800, 340), color=PRIMARY, width=2)
    draw_arrow(draw1, (710, 380), (570, 380), color=PRIMARY, width=2)
    draw_arrow(draw1, (390, 380), (250, 380), color=PRIMARY, width=2)

    draw1.text((275, 140), "Parsed Turns", fill=TEXT_MUTED, font=get_font(10))
    draw1.text((600, 140), "Ambiguity Tokens", fill=TEXT_MUTED, font=get_font(10))
    draw1.text((810, 260), "Resolved Candidates", fill=TEXT_MUTED, font=get_font(10))
    draw1.text((600, 360), "Confidence & Risk", fill=TEXT_MUTED, font=get_font(10))
    draw1.text((275, 360), "Complete Result", fill=TEXT_MUTED, font=get_font(10))

    out_path1 = os.path.join(OUTPUT_DIR, "fig4_dfd_level1.png")
    img1.save(out_path1)
    print("Generated:", out_path1)

# -------------------------------------------------------------------------
# 4. SYSTEM FLOWCHART
# -------------------------------------------------------------------------
def create_flowchart():
    img = Image.new("RGB", (1000, 600), BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw.text((30, 20), "Figure 4.5: System Process Flowchart of Contexta", fill=TEXT_MAIN, font=get_font(19, bold=True))

    f_box = get_font(12, bold=True)
    f_sub = get_font(10, bold=False)

    # 1. Start
    draw_rounded_rect(draw, (400, 70, 600, 110), radius=15, fill=PANEL_COLOR, outline=SUCCESS, width=2)
    draw.text((475, 83), "START", fill=SUCCESS, font=f_box)

    # 2. Input
    draw_arrow(draw, (500, 110), (500, 140), color=PRIMARY, width=2)
    draw_rounded_rect(draw, (360, 140, 640, 185), radius=6, fill=CARD_BG, outline=BORDER_COLOR)
    draw.text((385, 155), "Paste Conversation / Select Demo", fill=TEXT_MAIN, font=f_box)

    # 3. Parse turns
    draw_arrow(draw, (500, 185), (500, 215), color=PRIMARY, width=2)
    draw_rounded_rect(draw, (360, 215, 640, 260), radius=6, fill=CARD_BG, outline=BORDER_COLOR)
    draw.text((390, 230), "Parse Speakers & Message Turns", fill=TEXT_MAIN, font=f_box)

    # 4. Ambiguity scan decision
    draw_arrow(draw, (500, 260), (500, 290), color=PRIMARY, width=2)
    # Diamond decision
    draw.polygon([(500, 290), (620, 335), (500, 380), (380, 335)], fill=PANEL_COLOR, outline=WARNING, width=2)
    draw.text((425, 320), "Ambiguity Detected?", fill=WARNING, font=get_font(11, bold=True))

    # Branch No
    draw_arrow(draw, (620, 335), (760, 335), color=SUCCESS, width=2)
    draw.text((640, 315), "No", fill=SUCCESS, font=f_sub)
    draw_rounded_rect(draw, (760, 310, 960, 360), radius=6, fill=CARD_BG, outline=SUCCESS)
    draw.text((780, 325), "Mark Message Clear (Low Risk)", fill=TEXT_MAIN, font=get_font(11, bold=True))

    # Branch Yes
    draw_arrow(draw, (500, 380), (500, 410), color=PRIMARY, width=2)
    draw.text((510, 390), "Yes", fill=WARNING, font=f_sub)
    draw_rounded_rect(draw, (360, 410, 640, 455), radius=6, fill=CARD_BG, outline=BORDER_COLOR)
    draw.text((385, 425), "Context Matching & Candidate Ranking", fill=TEXT_MAIN, font=f_box)

    # Decision 2: Evidence sufficient?
    draw_arrow(draw, (500, 455), (500, 485), color=PRIMARY, width=2)
    draw.polygon([(500, 485), (620, 525), (500, 565), (380, 525)], fill=PANEL_COLOR, outline=ACCENT_CYAN, width=2)
    draw.text((430, 515), "Sufficient Evidence?", fill=ACCENT_CYAN, font=get_font(11, bold=True))

    # Yes branch -> Rewrite
    draw_arrow(draw, (380, 525), (240, 525), color=SUCCESS, width=2)
    draw.text((310, 505), "Yes", fill=SUCCESS, font=f_sub)
    draw_rounded_rect(draw, (60, 500, 240, 550), radius=6, fill=CARD_BG, outline=SUCCESS)
    draw.text((75, 515), "Generate Clear Rewrite", fill=TEXT_MAIN, font=get_font(11, bold=True))

    # No branch -> Clarification
    draw_arrow(draw, (620, 525), (760, 525), color=WARNING, width=2)
    draw.text((660, 505), "No", fill=WARNING, font=f_sub)
    draw_rounded_rect(draw, (760, 500, 960, 550), radius=6, fill=CARD_BG, outline=WARNING)
    draw.text((775, 515), "Generate Clarification Question", fill=TEXT_MAIN, font=get_font(11, bold=True))

    out_path = os.path.join(OUTPUT_DIR, "fig5_system_flowchart.png")
    img.save(out_path)
    print("Generated:", out_path)

# -------------------------------------------------------------------------
# 5. ENTITY RELATIONSHIP (ER) DIAGRAM
# -------------------------------------------------------------------------
def create_er_diagram():
    img = Image.new("RGB", (1000, 520), BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw.text((30, 20), "Figure 4.6: Entity-Relationship (ER) Schema Diagram", fill=TEXT_MAIN, font=get_font(19, bold=True))
    draw.text((30, 48), "Relational Model of SQLite Persistence Store and Enterprise Schema", fill=TEXT_MUTED, font=get_font(11))

    f_title = get_font(13, bold=True)
    f_field = get_font(11, bold=False)

    def draw_table(x, y, w, h, title, fields):
        draw_rounded_rect(draw, (x, y, x + w, y + h), radius=8, fill=CARD_BG, outline=BORDER_COLOR, width=2)
        draw_rounded_rect(draw, (x, y, x + w, y + 28), radius=8, fill=PANEL_COLOR, outline=BORDER_COLOR, width=1)
        draw.text((x + 10, y + 6), title, fill=PRIMARY, font=f_title)
        cy = y + 36
        for f in fields:
            draw.text((x + 10, cy), f, fill=TEXT_MAIN, font=f_field)
            cy += 18

    # Table 1: analyses
    draw_table(50, 100, 240, 160, "analyses", [
        "PK id: TEXT",
        "   created_at: TIMESTAMP",
        "   original: TEXT",
        "   payload: JSONB"
    ])

    # Table 2: ambiguities
    draw_table(380, 100, 250, 180, "ambiguities", [
        "PK id: TEXT",
        "FK analysis_id: TEXT",
        "   expression: TEXT",
        "   ambiguity_type: TEXT",
        "   resolved_ref: TEXT",
        "   evidence_score: INT"
    ])

    # Table 3: clarifications
    draw_table(720, 100, 240, 160, "clarifications", [
        "PK id: TEXT",
        "FK analysis_id: TEXT",
        "   question: TEXT",
        "   options: TEXT",
        "   resolved_answer: TEXT"
    ])

    # Table 4: rewrites
    draw_table(380, 330, 250, 150, "rewrites", [
        "PK id: TEXT",
        "FK analysis_id: TEXT",
        "   clear_message: TEXT",
        "   replacements: TEXT"
    ])

    # Relationships
    draw_arrow(draw, (290, 160), (380, 160), color=PRIMARY, width=2) # analyses -> ambiguities (1:N)
    draw_arrow(draw, (630, 160), (720, 160), color=PRIMARY, width=2) # ambiguities -> clarifications (1:N)
    draw_arrow(draw, (505, 280), (505, 330), color=PRIMARY, width=2) # ambiguities -> rewrites (1:1)

    draw.text((320, 140), "1 : N", fill=TEXT_MUTED, font=get_font(10, bold=True))
    draw.text((665, 140), "1 : N", fill=TEXT_MUTED, font=get_font(10, bold=True))
    draw.text((515, 295), "1 : 1", fill=TEXT_MUTED, font=get_font(10, bold=True))

    out_path = os.path.join(OUTPUT_DIR, "fig6_er_diagram.png")
    img.save(out_path)
    print("Generated:", out_path)

if __name__ == "__main__":
    create_architecture_diagram()
    create_use_case_diagram()
    create_dfd_diagrams()
    create_flowchart()
    create_er_diagram()
    print("All architectural diagrams generated successfully.")
