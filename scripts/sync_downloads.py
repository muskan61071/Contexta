import os
import shutil

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
client_public = os.path.join(base_dir, "client", "public")
client_dist = os.path.join(base_dir, "client", "dist")
project_doc = os.path.join(base_dir, "Project_Documentation")
project_doc_diagrams = os.path.join(project_doc, "diagrams")
diagrams_src = os.path.join(base_dir, "docs", "diagrams")

files = [
    "Contexta_Project_Presentation.pptx",
    "Contexta_Project_Report.docx",
    "Contexta_Project_Presentation.pdf",
    "Contexta_Project_Report.pdf"
]

os.makedirs(client_public, exist_ok=True)
os.makedirs(client_dist, exist_ok=True)
os.makedirs(project_doc, exist_ok=True)
os.makedirs(project_doc_diagrams, exist_ok=True)

for fname in files:
    src = os.path.join(base_dir, fname)
    if os.path.exists(src):
        # Copy to client/public
        dst_pub = os.path.join(client_public, fname)
        shutil.copy2(src, dst_pub)
        
        # Copy to client/dist
        dst_dist = os.path.join(client_dist, fname)
        shutil.copy2(src, dst_dist)
        
        # Copy to Project_Documentation
        dst_doc = os.path.join(project_doc, fname)
        shutil.copy2(src, dst_doc)
        print(f"Copied {fname} -> {dst_doc}")
    else:
        print(f"Source file not found: {src}")

# Also copy diagrams to Project_Documentation/diagrams
if os.path.exists(diagrams_src):
    for diag in os.listdir(diagrams_src):
        if diag.endswith(".png"):
            s_diag = os.path.join(diagrams_src, diag)
            d_diag = os.path.join(project_doc_diagrams, diag)
            shutil.copy2(s_diag, d_diag)
            print(f"Copied diagram: {diag} -> Project_Documentation/diagrams/")

print("Project_Documentation sync completed successfully.")
