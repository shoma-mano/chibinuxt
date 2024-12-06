generate で.nuxt に template を作成
そのテンプレートを input に nuxt の vite が dist/server/server に createApp を作成
nitroContext を渡された nitro は entries/dev を input に build して.nuxt/nitro に workerEntry を作成。
workerEntry は sever を起動するコードでそこで renderMiddleware(ファイル名は render) が登録されている。renderMiddleware は createApp を呼び出す。
