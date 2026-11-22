"""Black-and-white portrait for the About section.

assets-src/headshot-cutout-full.png (background already removed) is turned
greyscale, lit softly from behind and placed on a near-black backdrop.
Output: public/images/portrait-bw.webp (960x1200) and portrait-bw-sm.webp.
Run: npm run photo   (needs: pip install pillow)
"""
from PIL import Image, ImageOps, ImageEnhance, ImageDraw, ImageFilter

cut = Image.open('assets-src/headshot-cutout-full.png').convert('RGBA')
w, h = cut.size
grey = ImageOps.grayscale(cut.convert('RGB'))
grey = ImageOps.autocontrast(grey, cutoff=1)
grey = ImageEnhance.Contrast(grey).enhance(1.15)
grey = ImageEnhance.Brightness(grey).enhance(0.92)
subject = Image.merge('RGBA', (grey, grey, grey, cut.split()[3]))

W, H = 960, 1200
bg = Image.new('RGB', (W, H), (8, 8, 8))
glow = Image.new('L', (W, H), 0)
ImageDraw.Draw(glow).ellipse((W * 0.12, H * 0.05, W * 0.88, H * 0.75), fill=46)
glow = glow.filter(ImageFilter.GaussianBlur(160))
bg = Image.composite(Image.new('RGB', (W, H), (60, 60, 60)), bg, glow)

sub = subject.resize((W, int(h * W / w)), Image.LANCZOS)
bg.paste(sub, (0, H - sub.height + int(H * 0.02)), sub)
bg.save('public/images/portrait-bw.webp', 'WEBP', quality=82, method=6)
bg.resize((480, 600), Image.LANCZOS).save('public/images/portrait-bw-sm.webp', 'WEBP', quality=80, method=6)
print('portrait written')
