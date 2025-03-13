const path = require('path')

module.exports = {
    apps: [
        {
            name: 'yuzu-game-forum',
            port: '2333',
            cwd: path.join(__dirname),
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '2G',  // 不往大了设置，我4G内存不是白买了？
            script: './.output/server/index.mjs'
        }
    ]
}