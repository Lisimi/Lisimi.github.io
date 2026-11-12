# 本地查看 / Local viewing

使用 Chrome 或 Edge 直接打开此目录中的 `index.html`，无需启动服务。
Open `index.html` directly in Chrome or Edge. No server is required.

图片、脚本、样式和完整视频都在此目录中。移动或分享时，请保留整个目录及其相对路径，不要只复制 HTML 文件。
Keep this entire folder when moving or sharing it, including its relative paths.

`assets/videos/` 包含 6 个完整的网页播放版本，合计约 280.26 MB，比原始 2.65 GB 减少 89.44%。保留完整时长及原始 AAC 音轨。
`assets/videos/` contains six full-length web videos totalling approximately 280.26 MB, an 89.44% reduction from 2.65 GB. Full duration and the original AAC audio are retained.

## 视频优化 / Video optimisation

| Video | Original MB | Web MB | Web resolution |
| --- | ---: | ---: | --- |
| Alien Invasion | 176.94 | 18.27 | 1280 x 720 |
| Branching Narrative | 411.50 | 55.57 | 1280 x 720 |
| Turn-based Adventure | 630.62 | 71.87 | 1280 x 720 |
| Run & Shoot | 1001.64 | 84.09 | 540 x 1280 |
| Temple Display | 408.09 | 25.54 | 1280 x 720 |
| Base Defence | 24.82 | 24.91 | 1152 x 480 |

MB uses decimal units (1 MB = 1,000,000 bytes).

五个高码率视频使用 H.264、30 fps、原比例缩放；音轨直接复制，不重新编码。基地防卫已经是低码率视频，因此仅重新封装，保留原视频画质与帧时间。所有文件均启用 MP4 faststart，方便浏览器边下载边播放。
Five high-bitrate recordings use H.264 at 30 fps with proportional scaling. Audio streams are copied without re-encoding. Base Defence was already low bitrate and was only remuxed, preserving its video and frame timing. Every MP4 uses faststart for progressive playback.

原始视频仍保存在项目根目录下的 `Game Development/` 和 `3D modeling and animation production/Animation/` 中，未作修改。
Original recordings remain unchanged in `Game Development/` and `3D modeling and animation production/Animation/` at the workspace root.

已检查完整解码、时长、音轨一致性及代表画面。每个网页视频均小于 100 MiB。
Full decoding, durations, audio identity and representative frames have been checked. Every web video is below 100 MiB.
