# -*- coding: utf-8 -*-
"""Crop team photos to consistent head-and-shoulders framing."""
from pathlib import Path
import json
import os

import cv2

ROOT = Path(r"C:\goodbuild-app")
SRC = ROOT / "tmp" / "team-photos"
OUT = ROOT / "tmp" / "team-photos-normalized"
MODEL = ROOT / "tmp" / "face_detection_yunet_2023mar.onnx"
OUT.mkdir(parents=True, exist_ok=True)

OUT_W, OUT_H = 900, 1200
FACE_FRAC = 0.36
FACE_CY_FRAC = 0.31
# Extra zoom for photos still looking too far
ZOOM_BOOST = {
    2: 1.12,  # Albert
    4: 1.08,  # Alice
}

TEAM = [
    (1, "1-christy.jpg"),
    (2, "2-albert.jpeg"),
    (3, "3-ken.jpg"),
    (4, "4-alice.jpg"),
    (5, "5-rex.jpeg"),
    (6, "6-derek.jpg"),
    (8, "8-yc.jpeg"),
]


def detect_face(img_bgr):
    h, w = img_bgr.shape[:2]
    detector = cv2.FaceDetectorYN_create(str(MODEL), "", (w, h), 0.6, 0.3, 5000)
    detector.setInputSize((w, h))
    _, faces = detector.detect(img_bgr)
    if faces is None or len(faces) == 0:
        return None
    # faces: x, y, w, h, ...
    best = max(faces, key=lambda f: f[2] * f[3])
    return float(best[0]), float(best[1]), float(best[2]), float(best[3])


def crop_normalized(img_bgr, team_id=None):
    h, w = img_bgr.shape[:2]
    face = detect_face(img_bgr)

    if face is None:
        fx, fy, fw, fh = w * 0.3, h * 0.12, w * 0.4, h * 0.28
        found = False
    else:
        fx, fy, fw, fh = face
        found = True

    face_cx = fx + fw / 2
    face_cy = fy + fh / 2
    face_h = max(fh, 1)

    face_frac = FACE_FRAC * ZOOM_BOOST.get(team_id, 1.0)
    crop_h = face_h / face_frac
    crop_w = crop_h * (OUT_W / OUT_H)

    if crop_w > w * 0.98:
        crop_w = w * 0.98
        crop_h = crop_w * (OUT_H / OUT_W)
    if crop_h > h * 0.98:
        crop_h = h * 0.98
        crop_w = crop_h * (OUT_W / OUT_H)

    crop_x = face_cx - crop_w / 2
    crop_y = face_cy - crop_h * FACE_CY_FRAC

    crop_x = max(0, min(crop_x, w - crop_w))
    crop_y = max(0, min(crop_y, h - crop_h))

    x0, y0 = int(round(crop_x)), int(round(crop_y))
    x1, y1 = int(round(crop_x + crop_w)), int(round(crop_y + crop_h))
    cropped = img_bgr[y0:y1, x0:x1]
    resized = cv2.resize(cropped, (OUT_W, OUT_H), interpolation=cv2.INTER_AREA)
    return resized, found


def main():
    results = []
    for team_id, fname in TEAM:
        src = SRC / fname
        img = cv2.imread(str(src))
        if img is None:
            print(f"FAIL read {src}")
            continue
        out_img, found = crop_normalized(img, team_id)
        out_path = OUT / f"{team_id}.jpg"
        cv2.imwrite(str(out_path), out_img, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        print(f"{fname} -> {out_path.name} face={found}")
        results.append({"id": team_id, "path": str(out_path)})

    (OUT / "manifest.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print("done", len(results))


if __name__ == "__main__":
    main()
