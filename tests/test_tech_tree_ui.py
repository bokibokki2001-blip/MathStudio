"""Compatibility entrypoint for MathStudio v0.1.4 full-curriculum UI checks."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('test_full_curriculum_ui.py')),run_name='__main__')
