
import os
import shutil

TYPES = ['light', 'dark']
BASE_DIR = 'public/email-icons/fallback'

for t in TYPES:
    dir_path = os.path.join(BASE_DIR, t)
    if not os.path.exists(dir_path):
        continue
    
    for filename in os.listdir(dir_path):
        if filename.endswith('.png') and '_' in filename:
            # Format: hero_name_light_TIMESTAMP.png OR hero_name_dark_TIMESTAMP.png
            # Goal: hero_name.png
            
            # Remove extension
            name_no_ext = filename[:-4]
            
            # Split by parts
            parts = name_no_ext.split('_')
            
            # Find index of 'light' or 'dark'
            try:
                type_idx = parts.index(t)
                # Keep everything before the type marker
                new_name = '_'.join(parts[:type_idx]) + '.png'
                
                old_path = os.path.join(dir_path, filename)
                new_path = os.path.join(dir_path, new_name)
                
                print(f"Renaming {filename} -> {new_name}")
                os.rename(old_path, new_path)
            except ValueError:
                print(f"Skipping {filename} (pattern mismatch)")

# Ensure placeholder for missing dark icon
dark_order = os.path.join(BASE_DIR, 'dark', 'hero_order_confirm.png')
light_order = os.path.join(BASE_DIR, 'light', 'hero_order_confirm.png')

if not os.path.exists(dark_order) and os.path.exists(light_order):
    print("Creating placeholder for missing dark order icon")
    shutil.copy(light_order, dark_order)
