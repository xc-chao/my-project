#!/bin/bash
# 启动前后端项目脚本
# MySQL + 后端 Express + 前端 UniApp

PROJECT_ROOT="/Users/qq/Desktop/UniAppPencil"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend/miniprogram"
MYSQL_BIN="/usr/local/mysql/bin"

# 从 .env 读取数据库密码
DB_PASSWORD=$(grep '^DB_PASSWORD=' "$BACKEND_DIR/.env" 2>/dev/null | cut -d'=' -f2)
if [ -z "$DB_PASSWORD" ]; then
  echo -e "${RED}未找到数据库密码，请检查 backend/.env${NC}"
  exit 1
fi

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
  # 注意：MySQL 不随脚本停止，保持后台运行
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "========================================"
echo "       UniAppPencil 项目启动脚本"
echo "========================================"
echo ""

# 检查并启动 MySQL
echo -e "${YELLOW}[MySQL] 检查数据库状态...${NC}"
if "$MYSQL_BIN/mysqladmin" ping -u root -p$DB_PASSWORD &>/dev/null; then
  echo -e "${GREEN}[MySQL] 已在运行${NC}"
else
  echo -e "${YELLOW}[MySQL] 未运行，正在启动...${NC}"
  sudo /usr/local/mysql/support-files/mysql.server start
  # 等待 MySQL 就绪
  for i in $(seq 1 10); do
    if "$MYSQL_BIN/mysqladmin" ping -u root -p$DB_PASSWORD &>/dev/null; then
      echo -e "${GREEN}[MySQL] 启动成功${NC}"
      break
    fi
    if [ "$i" -eq 10 ]; then
      echo -e "${RED}[MySQL] 启动失败，请手动检查${NC}"
      exit 1
    fi
    sleep 1
  done
fi
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
