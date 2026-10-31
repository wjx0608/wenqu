"""生成问渠的 apple-touch-icon.png（180x180），与 favicon.svg 同款图形。

用法：python scripts/make-icon.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 180
RADIUS = 50
TOP = (0x5D, 0x85, 0x8A)
BOTTOM = (0x2F, 0x45, 0x48)
INK = (0xF1, 0xF5, 0xF4)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def bezier(p0, p1, p2, p3, steps=60):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        u = 1 - t
        x = u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


# 画布 + 对角线渐变
base = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
grad = Image.new("RGB", (SIZE, SIZE))
px = grad.load()
for y in range(SIZE):
    for x in range(SIZE):
        px[x, y] = lerp(TOP, BOTTOM, (x + y) / (2 * (SIZE - 1)))
base.paste(grad, (0, 0))

# 圆角遮罩
mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE - 1, SIZE - 1], radius=RADIUS, fill=255)
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
img.paste(base, (0, 0), mask)

draw = ImageDraw.Draw(img)

# 两道波纹（三次贝塞尔，单位换算到 180）
def wave(y_center, opacity):
    scale = SIZE / 64
    left = 12 * scale
    right = 52 * scale
    span = (right - left) / 2
    y = y_center * scale
    amp = 7.5 * scale
    p0 = (left, y)
    p1 = (left + span * 0.34, y - amp)
    p2 = (left + span * 0.66, y - amp)
    p3 = (left + span, y)
    first = bezier(p0, p1, p2, p3)
    p4 = (right, y)
    p5 = (right + span * 0.34 - span, y + amp)  # 镜像段
    second = bezier(
        p3,
        (p3[0] + span * 0.34, y + amp),
        (p3[0] + span * 0.66, y + amp),
        p4,
    )
    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    width = int(round(5.6 * scale))
    ld.line(first + second, fill=INK + (int(255 * opacity),), width=width, joint="curve")
    # 圆头
    r = width / 2
    for endpoint in (first[0], second[-1]):
        ld.ellipse(
            [endpoint[0] - r, endpoint[1] - r, endpoint[0] + r, endpoint[1] + r],
            fill=INK + (int(255 * opacity),),
        )
    img.alpha_composite(layer)


wave(25.5, 1.0)
wave(38.5, 0.7)

OUTPUT = Path(__file__).resolve().parent.parent / "public" / "apple-touch-icon.png"
img.save(OUTPUT)
print("saved", OUTPUT, img.size)
