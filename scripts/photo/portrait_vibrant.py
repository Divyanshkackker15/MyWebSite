"""Portrait assets for the opening, hero, author box, favicon and OG image.

Input: assets-src/headshot-cutout-full.png (background already removed).
The face is never reshaped or retouched; only colour, light and background change.

Outputs (public/images/me/):
  cut-mono-sm.webp / cut-mono.png   greyscale cutout with alpha (opening window)
  cut-colour.webp / -md / -sm / -xs the same cutout with the colour wash baked in
  avatar-256.webp / -512.webp / avatar-512.png   circular author avatar
public/favicon*.png, favicon.ico, apple-touch-icon.png, icon-192/512.png
Run: npm run photo   (needs: pip install pillow numpy)
"""
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw

OUT = 'public/images/me/'
import os
os.makedirs(OUT, exist_ok=True)

cut = Image.open('assets-src/headshot-cutout-full.png').convert('RGBA')
alpha = cut.split()[3]
w, h = cut.size

grey = ImageOps.grayscale(cut.convert('RGB'))
grey = ImageOps.autocontrast(grey, cutoff=1)
grey = ImageEnhance.Contrast(grey).enhance(1.12)
mono = Image.merge('RGBA', (grey, grey, grey, alpha))

# colour wash: luminance kept, hue from a diagonal blue → violet → magenta → red gradient
stops = np.array([[61, 123, 255], [139, 92, 246], [224, 64, 154], [240, 74, 74]], dtype=np.float32) / 255
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
t = np.clip((xx / w) * 0.65 + (yy / h) * 0.35, 0, 1) * (len(stops) - 1)
i = np.minimum(t.astype(int), len(stops) - 2)
f = (t - i)[..., None]
tint = stops[i] * (1 - f) + stops[i + 1] * f
L = np.asarray(grey, dtype=np.float32)[..., None] / 255
# soft-light style mix: shadows take the tint, highlights stay close to white
colour = np.where(L < 0.5, 2 * L * tint, 1 - 2 * (1 - L) * (1 - tint))
colour = 0.72 * colour + 0.28 * L  # keep some natural tone
colour_img = Image.fromarray((np.clip(colour, 0, 1) * 255).astype(np.uint8), 'RGB')
colour_cut = Image.merge('RGBA', (*colour_img.split(), alpha))


def save_cut(img, name):
    img.save(OUT + name + '.webp', 'WEBP', quality=74, method=6)
    img.resize((800, int(h * 800 / w)), Image.LANCZOS).save(OUT + name + '-md.webp', 'WEBP', quality=76, method=6)
    img.resize((w // 2, h // 2), Image.LANCZOS).save(OUT + name + '-sm.webp', 'WEBP', quality=78, method=6)


# the black-and-white cutout only shows inside the small opening window, so one small size is enough
mono.resize((w // 2, h // 2), Image.LANCZOS).save(OUT + 'cut-mono-sm.webp', 'WEBP', quality=78, method=6)
save_cut(colour_cut, 'cut-colour')
# tiny copy for the blurred rim glow behind the portrait (it's blurred anyway)
colour_cut.resize((w // 6, h // 6), Image.LANCZOS).save(OUT + 'cut-colour-xs.webp', 'WEBP', quality=70, method=6)
mono.resize((w // 2, h // 2), Image.LANCZOS).save(OUT + 'cut-mono.png', optimize=True)


def rim_light(size, subject):
    """Coloured glow hugging the silhouette, like a neon rim light."""
    a = subject.split()[3].filter(ImageFilter.GaussianBlur(size[0] / 60))
    edge = Image.eval(a, lambda v: min(255, int(v * 1.0)))
    glow = Image.new('RGBA', subject.size, (0, 0, 0, 0))
    left = Image.new('RGBA', subject.size, (61, 123, 255, 0))
    right = Image.new('RGBA', subject.size, (224, 64, 154, 0))
    ramp = Image.linear_gradient('L').rotate(90).resize(subject.size)
    mix = Image.composite(right, left, ramp)
    mix.putalpha(edge)
    glow = Image.alpha_composite(glow, mix)
    return glow


def on_black(subject, W, H, scale=1.0, y_anchor=1.0):
    bg = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    s = subject.resize((int(subject.width * W / subject.width * scale), int(subject.height * W / subject.width * scale)), Image.LANCZOS)
    x = (W - s.width) // 2
    y = int((H - s.height) * y_anchor)
    rim = rim_light((W, H), s)
    off = W // 90
    bg.alpha_composite(rim, (x - off, y))
    bg.alpha_composite(rim, (x + off, y))
    bg.alpha_composite(s, (x, y))
    fade = Image.linear_gradient('L').resize((W, H // 4))  # black → transparent towards the bottom edge
    shade = Image.new('RGBA', (W, H // 4), (0, 0, 0, 255))
    shade.putalpha(fade)
    bg.alpha_composite(shade, (0, H - H // 4))
    return bg.convert('RGB')


still = on_black(colour_cut, 1200, 1500, 0.92, 1.0)

# circular avatar: head and shoulders, centred on the face
face = colour_cut.crop((int(w * 0.12), int(h * 0.02), int(w * 0.88), int(h * 0.02) + int(w * 0.76)))
for size in (256, 512):
    sq = Image.new('RGBA', (size, size), (10, 10, 18, 255))
    g = Image.radial_gradient('L').resize((size, size)).point(lambda v: 255 - v)
    tintbg = Image.new('RGBA', (size, size), (60, 40, 120, 255))
    sq = Image.composite(tintbg, sq, g.point(lambda v: v // 3))
    fs = face.resize((size, size), Image.LANCZOS)
    sq.alpha_composite(fs)
    mask = Image.new('L', (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(sq, (0, 0), mask)
    out.save(OUT + f'avatar-{size}.webp', 'WEBP', quality=86, method=6)
    if size == 512:
        out.save(OUT + 'avatar-512.png', optimize=True)

# favicons from the avatar
av = Image.open(OUT + 'avatar-512.png').convert('RGBA')
for name, size in [('favicon-32.png', 32), ('favicon-48.png', 48), ('icon-192.png', 192), ('icon-512.png', 512)]:
    av.resize((size, size), Image.LANCZOS).save('public/' + name)
solid = Image.new('RGBA', av.size, (0, 0, 0, 255))
solid.alpha_composite(av)
solid.convert('RGB').resize((180, 180), Image.LANCZOS).save('public/apple-touch-icon.png')
av.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
print('portrait assets written to', OUT)

# vibrant portrait on black, as a small JPEG for the social preview card (satori/resvg read JPEG and PNG)
still.resize((480, 600), Image.LANCZOS).save(OUT + 'og-portrait.jpg', 'JPEG', quality=86)
