#!/bin/bash
# 启动前后端项目脚本
# 后端: Express (node --watch)
# 前端: UniApp 微信小程序 (uni -p mp-weixin)

PROJECT_ROOT="/Users/qq/Desktop/UniAppPencil"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend/miniprogram"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cleanup() {
  echo ""
  echo -e "${YELLOW}正在停止所有服务...${NC}"
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null
    echo -e "${GREEN}后端已停止${NC}"
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null
    echo -e "${GREEN}前端已停止${NC}"
  fi
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "========================================"
echo "       UniAppPencil 项目启动脚本"
echo "========================================"
echo ""

# 检查 node_modules
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
  echo -e "${YELLOW}后端依赖未安装，正在安装...${NC}"
  (cd "$BACKEND_DIR" && npm install)
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo -e "${YELLOW}前端依赖未安装，正在安装...${NC}"
  (cd "$FRONTEND_DIR" && npm install)
fi

# 启动后端
echo -e "${GREEN}[后端] 启动 Express 服务...${NC}"
(cd "$BACKEND_DIR" && npm run dev) &
BACKEND_PID=$!

# 等一秒让后端先跑起来
sleep 1

# 启动前端（默认微信小程序模式，可通过参数切换）
MODE="${1:-mp-weixin}"
echo -e "${GREEN}[前端] 启动 UniApp ($MODE)...${NC}"
(cd "$FRONTEND_DIR" && npm run "dev:$MODE") &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}所有服务已启动${NC}"
echo -e "后端 PID: $BACKEND_PID"
echo -e "前端 PID: $FRONTEND_PID"
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
echo ""

# 等待子进程
wait
