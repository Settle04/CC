# Windows批处理文件调用WSL中的Claude（中文路径问题）

## 问题

双击 `小野.bat` 启动 Claude 时，中文路径在 WSL 中乱码，导致目录不存在。

错误信息：`bash: line 1: cd: /home/settle/projects/鍔╂墜: No such file or directory`

## 原因

Windows 传递中文字符到 WSL 时编码错乱，路径变成 `/home/settle/projects/鍔╂墜`

## 解决方案

在 WSL 中创建 ASCII 软链接，绕过中文路径。

## 执行步骤

1. 在 WSL 创建软链接：`ln -sf /home/settle/projects/助手 /home/settle/projects/assistant`
2. 修改批处理文件路径：`助手` → `assistant`
3. 可选：加入 `pause` 保留窗口便于查看错误

## 批处理文件最终内容

```bat
@echo off
wsl -e bash -c "cd /home/settle/projects/assistant && claude"
pause
```

## 关键原理

软链接让 Windows 传递的路径不经过中文编码转换层。