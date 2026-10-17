"""Build Hush logo PNGs from the script-H icon and showcase wordmark."""
from pathlib import Path

from PIL import Image

ASSETS = Path(
    r"C:\Users\sathi\.cursor\projects\c-Users-sathi-Desktop-Hush\assets"
)
OUT = Path(r"c:\Users\sathi\Desktop\Hush\mobile\assets\logo")
IMAGES = Path(r"c:\Users\sathi\Desktop\Hush\mobile\assets\images")


def find(fragment: str) -> Path:
    matches = list(ASSETS.glob(f"*{fragment}*"))
    if not matches:
        raise SystemExit(f"missing {fragment}")
    return matches[0]


def content_box(im: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y][:3]
            if r + g + b > threshold:
                if x < minx:
                    minx = x
                if y < miny:
                    miny = y
                if x > maxx:
                    maxx = x
                if y > maxy:
                    maxy = y
    return minx, miny, maxx, maxy


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    icon = Image.open(find("99464830")).convert("RGB")
    tile = content_box(icon, 40)
    print("tile", tile)
    glyph = content_box(icon, 400)
    print("glyph", glyph)

    # Full-bleed app icon: cover-scale the rounded tile so it fills 1024.
    x0, y0, x1, y1 = tile
    crop = icon.crop((x0, y0, x1 + 1, y1 + 1))
    cw, ch = crop.size
    scale = 1024 / min(cw, ch)
    resized_tile = crop.resize(
        (round(cw * scale), round(ch * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized_tile.size[0] - 1024) // 2
    top = (resized_tile.size[1] - 1024) // 2
    app_icon = resized_tile.crop((left, top, left + 1024, top + 1024))
    app_icon.save(OUT / "hush-icon.png", optimize=True)
    app_icon.save(IMAGES / "icon.png", optimize=True)

    # White script H on transparent, centered with adaptive-icon safe padding.
    gx0, gy0, gx1, gy1 = glyph
    glyph_im = icon.crop((gx0, gy0, gx1 + 1, gy1 + 1)).convert("RGBA")
    gp = glyph_im.load()
    gw, gh = glyph_im.size
    for y in range(gh):
        for x in range(gw):
            r, g, b, a = gp[x, y]
            lum = (r + g + b) / 3
            if lum < 160:
                gp[x, y] = (255, 255, 255, 0)
            else:
                alpha = min(255, int((lum - 140) * 2.2))
                gp[x, y] = (255, 255, 255, alpha)

    canvas = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    # Keep the mark inside the Android adaptive safe zone (~66%).
    target = 560
    scale = target / max(gw, gh)
    resized = glyph_im.resize((int(gw * scale), int(gh * scale)), Image.Resampling.LANCZOS)
    canvas.paste(
        resized,
        ((1024 - resized.size[0]) // 2, (1024 - resized.size[1]) // 2),
        resized,
    )
    canvas.save(OUT / "hush-mark.png", optimize=True)
    canvas.save(IMAGES / "splash-icon.png", optimize=True)
    canvas.save(IMAGES / "android-icon-foreground.png", optimize=True)
    canvas.save(IMAGES / "android-icon-monochrome.png", optimize=True)
    canvas.resize((48, 48), Image.Resampling.LANCZOS).save(IMAGES / "favicon.png", optimize=True)

    # Android adaptive background: solid black.
    Image.new("RGBA", (512, 512), (0, 0, 0, 255)).save(IMAGES / "android-icon-background.png")

    # Wordmark: script "Hush" plus the honey heart on the first showcase screen.
    show = Image.open(find("Showcase-6445482d")).convert("RGB")
    word = show.crop((64, 72, 176, 134)).convert("RGBA")
    wp = word.load()
    ww, wh = word.size
    for y in range(wh):
        for x in range(ww):
            r, g, b, _a = wp[x, y]
            lum = (r + g + b) / 3
            honey = r > 180 and 110 < g < 220 and b < 110 and r > g
            if honey:
                wp[x, y] = (r, g, b, 255)
            elif lum > 185:
                alpha = min(255, int((lum - 160) * 3))
                wp[x, y] = (255, 255, 255, alpha)
            else:
                wp[x, y] = (0, 0, 0, 0)
    bbox = word.getbbox()
    if bbox:
        word = word.crop(bbox)
    # Source crop is small; scale up so the asset stays sharp enough on a phone.
    scale = 4
    word = word.resize((word.size[0] * scale, word.size[1] * scale), Image.Resampling.LANCZOS)
    word.save(OUT / "hush-wordmark.png", optimize=True)
    print("wordmark saved", word.size)


if __name__ == "__main__":
    main()
