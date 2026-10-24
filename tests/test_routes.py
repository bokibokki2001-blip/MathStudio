"""Run the updated straight/orthogonal geometry checks."""
import subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
r=subprocess.run(['node','tests/test_dependency_alignment.js'],cwd=root,check=True,text=True,capture_output=True)
print(r.stdout)
