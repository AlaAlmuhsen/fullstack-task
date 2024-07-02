import 'dotenv/config'
import App from "./app";





const app : App = new App()


async function start() {
    await app.init()
    app.listen()
}

start()