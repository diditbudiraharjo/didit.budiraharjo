# didit.budiraharjo

## Installed projects

### OpenCut

Vendored from [OpenCut-app/OpenCut](https://github.com/OpenCut-app/OpenCut.git) into [`opencut/`](opencut/).

OpenCut is a free, open-source video editor for web, desktop, and mobile. The vendored copy is the in-progress rewrite (Rust core, moon/proto tooling); the previously stable version lives at [opencut-app/opencut-classic](https://github.com/opencut-app/opencut-classic).

Setup (from `opencut/`):

```sh
# install proto (Linux/macOS/WSL)
bash <(curl -fsSL https://moonrepo.dev/install/proto.sh)

# install the toolchain pinned in .prototools
proto use

# run the apps
moon run web:dev       # localhost:5173
moon run api:dev       # localhost:8787
moon run desktop:dev   # see apps/desktop/README.md
```

See [`opencut/README.md`](opencut/README.md) for full upstream details.
