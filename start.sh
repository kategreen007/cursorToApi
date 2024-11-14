#!/bin/bash

# 检查 node 是否安装
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# 检查并安装缺失的依赖
echo "Checking and installing system dependencies..."
if [ -f /etc/os-release ]; then
    . /etc/os-release
    case "$ID" in
        "alpine")
            # Alpine Linux - 添加更多必要的依赖
            apk update
            apk add --no-cache \
                openssl \
                openssl-dev \
                libssl3 \
                libcrypto3 \
                libc6-compat
            ;;
        "ubuntu"|"debian")
            # Ubuntu/Debian
            apt-get update && apt-get install -y openssl libssl-dev
            ;;
        "centos"|"rhel"|"fedora")
            # CentOS/RHEL/Fedora
            dnf install -y openssl openssl-devel
            ;;
    esac
fi

# 安装依赖
echo "Installing dependencies..."
npm install

# 启动服务器
echo "Starting server..."
node server.js
