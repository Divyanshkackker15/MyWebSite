"""png -> <out>.webp (full) and <out>-sm.webp (half width), quality tuned for dark images."""
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
im.save(out + '.webp', 'WEBP', quality=82, method=6)
w, h = im.size
im.resize((w // 2, h // 2), Image.LANCZOS).save(out + '-sm.webp', 'WEBP', quality=80, method=6)
print('  render', out + '.webp', im.size)
