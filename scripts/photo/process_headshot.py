"""
Headshot pipeline: background removal, gentle colour grade, rim light, exports.

Run:  python3 scripts/photo/process_headshot.py
Needs: pip install numpy scipy pillow

Why a custom "colour-unmixing key" instead of an AI cut-out?
The original has a flat white studio background and dark hair. For each
edge pixel we know the background colour (white) and can estimate the
foreground colour from nearby solid pixels, so we can solve
    observed = alpha * foreground + (1 - alpha) * white
for alpha. That keeps individual hair strands and removes the white
"halo" (spill) that usually surrounds cut-outs.

The face itself is never reshaped, smoothed or retouched: we only touch
colour (a light grade) and a thin strip right at the silhouette edge (rim).
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets-src" / "headshot-original.webp"
OUT = ROOT / "public" / "images"
ICONS = ROOT / "public"
OUT.mkdir(parents=True, exist_ok=True)

AMBER = np.array([255, 181, 71]) / 255.0   # --amber
CYAN = np.array([79, 209, 255]) / 255.0    # --cyan
NAVY = np.array([7, 10, 18]) / 255.0       # --void


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- 1. load
img = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float64) / 255.0
H, W, _ = img.shape
white = np.median(np.concatenate([img[:20, :20].reshape(-1, 3), img[:20, -20:].reshape(-1, 3)]), axis=0)

# distance of every pixel from the background colour
dist = np.linalg.norm(img - white, axis=2)

# ---------------------------------------------------------------- 2. which pixels are background?
# "near white" pixels that are connected to the image border = background.
# Near-white pixels *inside* the subject (eye highlights, ear stud) are not
# connected to the border, so they stay part of the subject.
near_white = dist < 0.10
labels, _ = ndi.label(near_white)
border_labels = np.unique(np.concatenate([labels[0], labels[:, 0], labels[:, -1]]))
border_labels = border_labels[border_labels != 0]
bg = np.isin(labels, border_labels)

# Near-white "islands" inside the silhouette are of two kinds:
#  - gaps between hair strands (surrounded by dark hair)  -> background
#  - the ear stud / eye highlights (surrounded by skin)    -> keep opaque
# We tell them apart by the colour of a thin ring around each island.
lum_img = 0.2126 * img[..., 0] + 0.7152 * img[..., 1] + 0.0722 * img[..., 2]
inner_white = near_white & ~bg
isl, n_isl = ndi.label(inner_white)
keep_opaque = np.zeros((H, W), bool)
bg_ext = bg.copy()
for i, sl in enumerate(ndi.find_objects(isl), start=1):
    y0, y1 = max(0, sl[0].start - 4), min(H, sl[0].stop + 4)
    x0, x1 = max(0, sl[1].start - 4), min(W, sl[1].stop + 4)
    m = isl[y0:y1, x0:x1] == i
    ring = ndi.binary_dilation(m, iterations=3) & ~m
    touches_bg = (ring & bg[y0:y1, x0:x1]).any()
    ring &= ~bg[y0:y1, x0:x1]
    # skin is warm (red > blue); hair blended with white is neutral grey
    warm = (img[y0:y1, x0:x1, 0] - img[y0:y1, x0:x1, 2])[ring].mean() if ring.any() else 0
    if not touches_bg and warm > 0.08 and lum_img[y0:y1, x0:x1][ring].mean() > 0.35:
        keep_opaque[y0:y1, x0:x1] |= m
    else:
        bg_ext[y0:y1, x0:x1] |= m

# Pixels within R px of the background are the "unknown" band where we
# compute a soft alpha. R is generous so loose hair strands are included.
dist_to_bg = ndi.distance_transform_edt(~bg_ext)
R = 28
band = (~bg_ext) & (dist_to_bg <= R)
core = (~bg_ext) & (dist_to_bg > R)

# ---------------------------------------------------------------- 3. estimate foreground colour in the band
# Normalised convolution: average colour of nearby *solid* pixels.
solid = (core | ((~bg_ext) & (dist > 0.55))).astype(np.float64)
sig = 9
den = ndi.gaussian_filter(solid, sig) + 1e-6
F = np.stack([ndi.gaussian_filter(img[..., c] * solid, sig) / den for c in range(3)], axis=2)
# where no solid pixels are near, fall back to dark hair colour
far = den < 0.02
F[far] = np.array([0.10, 0.09, 0.10])

# ---------------------------------------------------------------- 4. solve alpha (projection onto the white->F line)
v = F - white
num = np.sum((img - white) * v, axis=2)
den2 = np.sum(v * v, axis=2) + 1e-6
alpha_band = np.clip(num / den2, 0, 1)
# slight curve: firm up nearly-solid pixels, drop faint noise
alpha_band = smoothstep(0.08, 0.92, alpha_band)

alpha = np.zeros((H, W))
alpha[core] = 1.0
alpha[band] = alpha_band[band]
alpha[keep_opaque] = 1.0
# the shirt is cut by the bottom edge: keep it solid there
alpha[-3:, :] = np.where(bg[-3:, :], 0, 1)

# ---------------------------------------------------------------- 5. unmix colour (remove white spill)
a3 = alpha[..., None]
unmixed = (img - (1 - a3) * white) / np.maximum(a3, 1e-3)
unmixed = np.clip(unmixed, 0, 1)
# for very transparent pixels trust the estimated foreground colour more
w = smoothstep(0.15, 0.6, alpha)[..., None]
fg = np.where(band[..., None], w * unmixed + (1 - w) * F, img)

# ---------------------------------------------------------------- 6. gentle colour grade (no skin smoothing)
lum = (0.2126 * fg[..., 0] + 0.7152 * fg[..., 1] + 0.0722 * fg[..., 2])[..., None]
graded = fg.copy()
graded = 0.5 + (graded - 0.5) * 1.05                    # +5% contrast
graded = lum + (graded - lum) * 0.96                    # -4% saturation
shadow = (1 - smoothstep(0.0, 0.35, lum))               # tint only the deep shadows toward the page navy
graded = graded * (1 - 0.18 * shadow) + np.array([0.06, 0.09, 0.17]) * 0.18 * shadow
graded = np.clip(graded, 0, 1)

# ---------------------------------------------------------------- 7. rim light
# A thin strip just inside the silhouette, warm amber from the right,
# cool cyan from the left. Screen-blended so it reads as light, not paint.
inner_edge = np.clip(alpha - ndi.gaussian_filter(ndi.grey_erosion(alpha, size=7), 4), 0, 1)
inner_edge = ndi.gaussian_filter(inner_edge, 1.2) * 1.8
inner_edge = np.clip(inner_edge, 0, 1) * alpha
xs = np.linspace(0, 1, W)[None, :].repeat(H, 0)
ys = np.linspace(0, 1, H)[:, None].repeat(W, 1)
fade_bottom = 1 - smoothstep(0.40, 0.58, ys)            # rim only on hair and ears, not along the beard/shoulders
right = smoothstep(0.42, 0.85, xs) * fade_bottom
left = (1 - smoothstep(0.15, 0.55, xs)) * fade_bottom
amber_amt = (inner_edge * right * 0.7)[..., None]
cyan_amt = (inner_edge * left * 0.28)[..., None]
lit = 1 - (1 - graded) * (1 - AMBER * amber_amt)
lit = 1 - (1 - lit) * (1 - CYAN * cyan_amt)
lit = np.clip(lit, 0, 1)

rgba = np.dstack([lit, alpha])
rgba8 = (rgba * 255 + 0.5).astype(np.uint8)
cut = Image.fromarray(rgba8, "RGBA")

# trim to content with a little headroom
ys_, xs_ = np.where(alpha > 0.02)
pad = 24
box = (max(0, xs_.min() - pad), max(0, ys_.min() - pad), min(W, xs_.max() + pad), H)
cut = cut.crop(box)
cut.save(ROOT / "assets-src" / "headshot-cutout-full.png")


def save_pair(im: Image.Image, stem: str, quality=80):
    im.save(OUT / f"{stem}.webp", "WEBP", quality=quality, method=6)
    im.save(OUT / f"{stem}.png", "PNG", optimize=True)


# ---------------------------------------------------------------- 8. exports
# Portrait (transparent) for Hero / About: desktop + mobile sizes
for width, name in [(960, "portrait-desktop"), (560, "portrait-mobile")]:
    h = round(cut.height * width / cut.width)
    save_pair(cut.resize((width, h), Image.LANCZOS), name)

# Circular avatar: head and shoulders on a navy disc with an amber ring
def avatar(size: int) -> Image.Image:
    # square crop around the face (coordinates of the original image)
    cx, cy, half = 545 - box[0], 660 - box[1], 540
    sq = cut.crop((cx - half, cy - half, cx + half, cy + half)).resize((size, size), Image.LANCZOS)
    bg_disc = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    grad = Image.new("RGBA", (size, size))
    gd = ImageDraw.Draw(grad)
    for i in range(size):  # vertical gradient navy → slightly lifted navy
        t = i / size
        c = tuple(int(v) for v in (14 + 8 * (1 - t), 19 + 10 * (1 - t), 32 + 16 * (1 - t)))
        gd.line([(0, i), (size, i)], fill=c + (255,))
    bg_disc.alpha_composite(grad)
    bg_disc.alpha_composite(sq)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(bg_disc, (0, 0), mask)
    ring = Image.new("RGBA", (size * 4, size * 4), (0, 0, 0, 0))
    rw = max(4, size // 32) * 4
    ImageDraw.Draw(ring).ellipse((rw // 2, rw // 2, size * 4 - rw // 2, size * 4 - rw // 2), outline=(255, 181, 71, 255), width=rw)
    out.alpha_composite(ring.resize((size, size), Image.LANCZOS))
    return out


for s in (512, 256):
    save_pair(avatar(s), f"avatar-{s}")

# Favicons (square, navy background so they read on light and dark tabs)
for s, name in [(32, "favicon-32.png"), (48, "favicon-48.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    av = avatar(max(s * 2, 128)).resize((s, s), Image.LANCZOS)
    if name.startswith("apple"):
        sq = Image.new("RGBA", (s, s), (7, 10, 18, 255))
        sq.alpha_composite(av)
        av = sq
    av.save(ICONS / name, optimize=True)
avatar(64).resize((48, 48), Image.LANCZOS).save(ICONS / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

print("done:", sorted(p.name for p in OUT.iterdir()))
