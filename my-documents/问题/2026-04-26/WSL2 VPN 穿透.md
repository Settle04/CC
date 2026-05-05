# WSL2 VPN 穿透问题

## 环境
- WSL2，配置了 `.wslconfig`：`networkingMode=mirrored`, `dnsTunneling=true`, `firewall=true`, `autoProxy=true`
- Windows 端运行 Clash Verge，开启了"系统代理"和"局域网连接"
- Windows 主机 IP：192.168.1.1

## 症状
- WSL2 内无 VPN 相关的网络接口（无 tun/wg/clash 设备）
- `curl ip.sb` 显示的是 WSL 自身 IP（通过家庭网络直接上网），不是代理出口 IP
- 尝试连接 Windows 主机（192.168.1.1）的 7890 / 20171 端口均失败：`Connection refused`
- 说明流量没有经过 Clash 代理

## 已确认
- `.wslconfig` 配置正确（mirrored 模式）
- Clash Verge 在 Windows 端运行中
- Windows 主机 ARP 显示可达（192.168.1.1 REACHABLE）

## 疑点
- Clash Verge 在 Windows 上的实际监听端口未知（默认 7890/20171 无法连接）
- Windows 防火墙是否阻止了入站连接未确认
- `autoProxy=true` 是否真正生效未确认

## 状态
- **未解决**
