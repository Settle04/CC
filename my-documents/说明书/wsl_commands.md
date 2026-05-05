# WSL 常用命令参考
> 适用对象：新手至中级用户 | 基于 Ubuntu/Debian 类发行版

## 文件与目录操作
> 这些是 Linux 最基本的文件操作命令，Windows 用户需要适应没有盘符的概念（`C:\` 变成 `/mnt/c/`）

| 命令 | 说明 |
|------|------|
| `ls -la` | 列出当前目录所有文件（含隐藏文件，详细信息） |
| `cd <目录>` | 进入指定目录 |
| `pwd` | 显示当前工作目录 |
| `mkdir <目录名>` | 创建目录 |
| `rm -rf <文件/目录>` | 删除文件或目录（强制） |
| `cp <源> <目标>` | 复制文件 |
| `mv <源> <目标>` | 移动/重命名文件 |
| `cat <文件>` | 查看文件内容 |
| `touch <文件>` | 创建空文件或更新文件时间 |

## 系统与网络
> WSL 有自己的 IP，每次重启可能变化；Windows 主机 IP 通过 `nameserver` 访问

| 命令 | 说明 |
|------|------|
| `wsl.exe -l -v` | 列出所有 WSL 发行版及状态（VERSION 列：1=WSL1，2=WSL2） |
| `wsl.exe --shutdown` | 关闭所有 WSL 实例（相当于重启 WSL，修复网络卡顿等） |
| `wsl.exe -t <发行版>` | 强制终止指定发行版（类似任务管理器结束进程） |
| `wsl.exe --status` | 查看 WSL 整体状态（默认安装位置、内存占用等） |
| `wsl.exe --update` | 检查并更新 WSL 内核 |
| `ip addr` | 查看 WSL 内部 IP（WSL2 有自己的网络栈） |
| `ping <地址>` | 测试网络连接（Ctrl+C 停止） |
| `curl <URL>` | 请求 HTTP 资源（调试 API、下载文件） |
| `netstat -tlnp` | 查看监听端口（谁在监听哪个端口） |
| `ss -tlnp` | 同上，更现代的替代命令 |
| `ps aux` | 查看所有进程（类似任务管理器） |
| `top` / `htop` | 查看系统资源占用（htop 更直观，需安装） |

## 包管理（取决于发行版）
> Ubuntu/Debian 用 apt，Fedora 用 dnf，Arch 用 pacman，命令大同小异

| 命令 | 说明 |
|------|------|
| `sudo apt update && sudo apt upgrade` | 更新包列表并升级所有可更新包（新手必学第一步） |
| `sudo apt install <包名>` | 安装软件包 |
| `sudo apt remove <包名>` | 卸载软件包（保留配置） |
| `sudo apt purge <包名>` | 完全卸载（删除配置） |
| `pip install <包名>` | 安装 Python 包 |
| `npm install <包名>` | 安装 Node.js 包 |

## Windows 互操作
> WSL 能直接调用 Windows 程序，Windows 也能运行 Linux 程序，这是 WSL 最大优势

| 命令 | 说明 |
|------|------|
| `explorer.exe .` | 在 Windows 文件浏览器中打开当前目录 |
| `cmd.exe /c <命令>` | 在 WSL 中执行 Windows CMD 命令 |
| `powershell.exe -c <命令>` | 在 WSL 中执行 PowerShell 命令 |
| `notepad.exe <文件>` | 用记事本打开文件 |
| `code .` | 用 VS Code 打开当前目录（需安装 Remote - WSL 扩展） |
| `/mnt/<盘符>/...` | 访问 Windows 分区（如 `/mnt/c/`） |
| `$WIN_HOME` | Windows 用户目录（需手动设置，通常为 `/mnt/c/Users/你的用户名`） |

## WSL 命令行选项
> 这些命令在 Windows CMD 或 PowerShell 中执行（不是 WSL 内部）

| 命令 | 说明 |
|------|------|
| `wsl -l -v` | 列出所有 WSL 发行版及状态 |
| `wsl -d <发行版>` | 启动指定发行版 |
| `wsl --install` | 安装 WSL（Windows 功能，需管理员权限） |
| `wsl --update` | 更新 WSL 内核 |
| `wsl --shutdown` | 关闭所有 WSL 实例 |
| `wsl -t <发行版>` | 终止指定发行版 |
| `wsl --export <发行版> <文件.tar>` | 导出发行版为 tar 文件（备份用） |
| `wsl --import <发行版> <路径> <文件.tar>` | 导入发行版（恢复或迁移） |
| `wsl -e <命令>` | 直接执行 Linux 命令（不启动 Shell） |
| `wsl --mount <磁盘> <挂载点>` | 挂载物理磁盘到 WSL（访问 Linux 分区） |

## 文件权限
> Linux 核心概念：每个文件有所有者、用户组、其他人三层权限（r=读 w=写 x=执行）

| 命令 | 说明 |
|------|------|
| `chmod <权限> <文件>` | 修改文件权限（如 `chmod +x script.sh` 让脚本可执行） |
| `chown <用户>:<用户组> <文件>` | 修改文件所有者 |
| `ls -ld <目录>` | 查看目录权限（而非其内容） |

## 杂项

| 命令 | 说明 |
|------|------|
| `history` | 查看命令历史（history -c 清除历史） |
| `grep <关键词> <文件>` | 在文件中搜索关键词（grep -r 递归搜索） |
| `tar -czvf <归档.tar.gz> <目录>` | 压缩目录为 tar.gz |
| `tar -xzvf <归档.tar.gz>` | 解压 tar.gz 归档 |
| `ssh <用户>@<主机>` | 远程登录 |
| `git <命令>` | Git 版本控制 |
| `docker <命令>` | Docker 容器操作 |
| `ufw status` | 查看防火墙状态（Ubuntu） |
| `sudo ufw enable` | 启用防火墙 |
| `sudo ufw allow <端口>` | 开放端口 |

## 服务管理
> Linux 服务相当于 Windows 的"后台服务"，常用于开机启动、持续运行的程序

| 命令 | 说明 |
|------|------|
| `systemctl status <服务名>` | 查看服务状态（是否在运行） |
| `sudo systemctl start <服务名>` | 启动服务 |
| `sudo systemctl stop <服务名>` | 停止服务 |
| `sudo systemctl restart <服务名>` | 重启服务（修改配置后常用） |
| `sudo systemctl enable <服务名>` | 设置开机自启 |
| `sudo systemctl disable <服务名>` | 取消开机自启 |
| `service <服务名> status` | 旧式服务命令（部分系统仍用） |

## 磁盘与挂载
> WSL2 中 Windows 分区自动挂载在 `/mnt/` 下，但 Linux 分区或外部设备需要手动挂载

| 命令 | 说明 |
|------|------|
| `lsblk` | 查看所有磁盘和分区（类似 Windows 的磁盘管理） |
| `mount -t drvfs <分区> <挂载点>` | 手动挂载 Windows 分区（如 `mount -t drvfs C: /mnt/windows`） |
| `umount <挂载点>` | 卸载分区（拔出U盘前必须先卸载） |
| `df -h` | 查看磁盘使用情况 |

## WSL 配置（wsl.conf）
> 配置文件位于 `/etc/wsl.conf`，控制 WSL 启动行为，修改后需重启 WSL 生效

| 配置项 | 说明 |
|------|------|
| `[automount]` | 自动挂载 Windows 分区 |
| `enabled = true` | 开启自动挂载 |
| `mountFsTab = true` | 读取 `/etc/fstab` 中的挂载配置 |
| `[network]` | 网络配置 |
| `hostname = <名称>` | WSL 主机名 |
| `[interop]` | Windows 互操作配置 |
| `enabled = true` | 允许 Windows 调用 Linux 程序 |

## GPU / 加速
> WSL2 支持 GPU 加速，用于 AI/ML、图形处理等

| 命令 | 说明 |
|------|------|
| `nvidia-smi` | 查看 NVIDIA GPU 状态（需安装 CUDA 驱动） |
| `dxdiag` | Windows 下查看 DirectX 状态 |