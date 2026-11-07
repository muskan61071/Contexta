# Optional NLP models

No pretrained or remote language model is required for this build. The active pipeline is the deterministic fallback under `app/pipeline` and `app/rules`. Place locally approved model files here only if you implement a provider in `app/models`; never commit credentials or expose them to the client.
