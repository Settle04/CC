# Remotion 视频渲染 - 提示词方案

## 目标
让执行 CC 渲染一个简单视频，验证 Remotion 项目是否正常工作。

## 执行 CC 提示词

```
请帮我完成以下任务：

1. 启动 Remotion 开发服务器：
   cd /home/settle/projects/plan-video
   npm run dev

2. 使用 Remotion 内置的 HelloWorld 模板渲染一个视频：
   - HelloWorld 模板已存在于 src/HelloWorld/
   - 渲染命令：npx remotion render HelloWorld /tmp/remotion-test.mp4
   - 参数：width=1920, height=1080, fps=30, duration=150帧(5秒)

3. 渲染完成后，确认 /tmp/remotion-test.mp4 文件已生成

注：内容不重要，只需要验证视频能正常渲染输出即可。
```

## 预期结果
- `/tmp/remotion-test.mp4` 文件生成
- 文件大小正常（非空）
- 可用播放器播放

## 注意事项
- 使用 HelloWorld 模板，无需修改任何代码
- 如果遇到问题，查看终端错误信息
