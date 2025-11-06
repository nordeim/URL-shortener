import os
import shutil

# Create dist directory
dist_dir = '/workspace/dist'
if os.path.exists(dist_dir):
    shutil.rmtree(dist_dir)
os.makedirs(dist_dir)

# Copy necessary files
files_to_copy = [
    ('.next', '.next'),
    ('public', 'public'),
    ('package.json', 'package.json'),
    ('server.js', 'server.js'),
    ('.env.local', '.env'),
    ('next.config.mjs', 'next.config.mjs'),
]

for src, dst in files_to_copy:
    src_path = f'/workspace/{src}'
    dst_path = f'{dist_dir}/{dst}'
    try:
        if os.path.exists(src_path):
            if os.path.isdir(src_path):
                shutil.copytree(src_path, dst_path)
            else:
                shutil.copy2(src_path, dst_path)
            print(f'Copied: {src}')
        else:
            print(f'Missing: {src}')
    except Exception as e:
        print(f'Error copying {src}: {e}')

print(f'\nDist directory contents: {os.listdir(dist_dir)}')
print(f'Dist directory size: {sum(os.path.getsize(os.path.join(dp, f)) for dp, dn, fn in os.walk(dist_dir) for f in fn) / 1024 / 1024:.2f} MB')
