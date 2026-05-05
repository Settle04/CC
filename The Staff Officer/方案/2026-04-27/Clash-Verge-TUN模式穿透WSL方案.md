# Clash Verge TUN 模式穿透 WSL 方案

## 目标
让 Windows 上的 Clash Verge VPN 流量能够穿透到 WSL2 环境

## 背景
- Clash Verge 支持 TUN（虚拟网卡）模式，可以在系统层级拦截流量
- WSL2 通过虚拟网络适配器连接 Windows 宿主机
- TUN 模式理论上可以更好地覆盖 WSL 的流量

## 当前环境（已填写）
- WSL 版本：WSL2（默认版本 2）
- WSL IP：192.168.1.x（网段 192.168.1.0/24）
- 默认网关：192.168.1.1
- DNS 服务器：10.255.255.254（WSL 内部 DNS 转发）
- Windows 宿主机 IP：192.168.1.8（无线局域网适配器 WLAN）

## 步骤规划

| 步骤 | 内容 | 状态 |
|------|------|------|
| 1 | 检查当前环境（WSL 版本、网络模式） | ✅ 已完成 |
| 2 | 在 Clash Verge 中启用 TUN 模式 | ✅ 已完成（TUN 已开启，Mixed Port: 7897）|
| 3 | 获取 Windows 宿主机 IP 和代理端口 | 待执行 |
| 4 | 配置 WSL 代理环境变量 | 待执行 |
| 5 | 验证连接是否生效 | 待执行 |

## 详细步骤

### 步骤 1：检查当前环境

在 WSL 终端执行以下命令：

```bash
# 检查 WSL 版本
wsl.exe --status

# 检查 WSL 内部 IP 和网关
ip route show

# 检查 /etc/resolv.conf 中的 DNS 服务器
cat /etc/resolv.conf
```

### 步骤 2：启用 Clash Verge TUN 模式

1. 打开 Clash Verge
2. 进入设置 → TUN 模式
3. 启用 TUN 模式
4. 推荐配置：
   - 启用 `Auto Redir` 或 `Enhanced Mode`
   - 设置合适的 TUN 端口

### 步骤 3：获取 Windows 宿主机 IP 和代理端口

在 **Windows CMD 或 PowerShell** 中执行：

```cmd
ipconfig
```

找到对应的网络连接（通常是 "以太网适配器 vEthernet (WSL)" 或类似），记录 IPv4 地址。

Clash Verge 默认端口：
- Mixed Port: 7890
- HTTP Port: 7891
- SOCKS5 Port: 7892

### 步骤 4：配置 WSL 代理环境变量

在 WSL 终端执行（将 `YOUR_WINDOWS_IP` 和 `YOUR_PORT` 替换为实际值）：

```bash
export ALL_PROXY="http://YOUR_WINDOWS_IP:7890"
export HTTPS_PROXY="http://YOUR_WINDOWS_IP:7890"
export HTTP_PROXY="http://YOUR_WINDOWS_IP:7890"
```

或者写入 `~/.bashrc` 以永久生效：

```bash
echo 'export ALL_PROXY="http://YOUR_WINDOWS_IP:7890"' >> ~/.bashrc
source ~/.bashrc
```

### 步骤 5：验证连接

```bash
# 测试代理是否生效
curl -I https://www.google.com

# 查看当前出口 IP
curl ipinfo.io
```

## 注意事项

1. 如果启用了 TUN 模式后 WSL 仍无法连接，可能是 WSL 网络模式问题
2. 部分场景下需要关闭 Windows 防火墙或添加规则
3. 如果 TUN 模式与 WSL 存在冲突，考虑使用 `clash-meta` 内核的增强模式

## 执行记录

| 时间 | 操作 | 结果 |
|------|------|------|
| 2026-04-27 | 方案制定 | - |
| 2026-04-27 | 步骤1-2 | WSL2，Windows IP 192.168.1.8，代理端口 7897 |
| 2026-04-27 | 步骤4测试 | ❌ Connection refused（端口 7897 无法连接） |

## 问题分析

连接被拒绝原因：
- TUN 模式不走 HTTP 代理端口，需要检查 TUN 模式具体配置
- 用户提供了截图（待分析）

## 待解决问题
- 图片无法识别（需要解决）

## 新发现

### 直连测试失败
```
curl: (35) error:0A000126:SSL routines::unexpected eof while reading
```
- WSL 取消代理后直连也失败
- 说明 TUN 模式可能影响了 WSL 的直连网络
- 可能存在 TUN 模式与 WSL 镜像网络模式的冲突
