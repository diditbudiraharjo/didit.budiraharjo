# Installing SkyReels-V2

Source vendored from https://github.com/SkyworkAI/SkyReels-V2 @ `9351d13152207cc04de780e055346b08ade0b851` (2026-01-29). See `README.md` in this directory for full upstream docs.

## 1. Environment

- Python 3.10.12 (tested by upstream)
- A CUDA GPU. Minimum VRAM by model:
  - 1.3B @ 540P: ~14.7GB
  - 14B @ 540P: ~43.4-51.2GB (higher for 720P)

## 2. Install dependencies

```bash
cd SkyReels-V2
pip install -r requirements.txt
```

`flash_attn` and `xfuser` in requirements.txt need a matching CUDA toolkit/compiler on the machine to build.

## 3. Download model weights

Weights are not included in this repo. Pull them from Hugging Face or ModelScope, e.g.:

```bash
pip install "huggingface_hub[cli]"
huggingface-cli download Skywork/SkyReels-V2-T2V-14B-540P --local-dir ./models/SkyReels-V2-T2V-14B-540P
```

Swap the model id for the size/resolution/type you need (1.3B/5B/14B, 540P/720P, T2V/I2V/DF).

## 4. Run

```bash
python3 generate_video.py \
  --model_id ./models/SkyReels-V2-T2V-14B-540P \
  --prompt "your description" \
  --num_frames 97 \
  --guidance_scale 6.0
```

Multi-GPU: `torchrun --nproc_per_node=<N> generate_video.py ...` (xDiT USP).

## Note on this environment

This sandbox has no GPU, so steps 3-4 cannot be executed here. Step 2 (`pip install`) can be run to validate dependency resolution, but `flash_attn`/`xfuser` builds will likely fail without a CUDA toolchain.
