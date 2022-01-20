const mineflayer = require('mineflayer')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const bot = mineflayer.createBot({
    host: 'play.derycube.fr',
    username: 'JeanMicheal123',
    version: '1.9.4'
})

/* VARIABLES */
const loginCode = '1';
let logged = false;
const obesePersonToCheck = ["BBLANCHEE", "Dutchum", "SusJoinTboy", "Diablotinn_", "Koziade", "Kayzenn_", "Ayskio", "Paulot123YT", "Mizuuge", "Lazgard", "Petitlixof_", "Cilde", "XhiteFX", "Akusito_o", "Le_mana_flux", "Kinderbueno", "Reachaurax_", "Kiyanor"]
let obesePerson = [];
let obeseChecked = 0;
const milisecondeBeforeLogin = 500;

const port = process.env.PORT || 5000;
const app = express()



/* LOOP CHECKER */
function obese() {
    if(logged) {
        if (obeseChecked >= obesePersonToCheck.length) {
            obeseChecked = 0;
        }
        bot.chat("/msg " + obesePersonToCheck[obeseChecked] + " 1")
        obeseChecked++;
    }
}
setInterval(obese, 1500);

/* LOOP RECEIVER */
bot.on('message', jsonMsg => {
    const message = jsonMsg.getText()
    console.log(message)
    if(message.includes("register")) {
        bot.chat("/r " + loginCode + " " + loginCode)
    } if (message.includes("login")) {
        setTimeout(function() {
            bot.chat("/login " + loginCode)
            logged = true;
            log("Successfully logged !")
        }, milisecondeBeforeLogin)
    }

    const actualPerson = obesePersonToCheck[obeseChecked - 1]
    const actualPersonIndex = obesePersonToCheck.indexOf(actualPerson)
    if (logged) {
        if(message.includes("Message envoyé")){
            if(!obesePerson.includes(actualPerson)){
                obesePerson.push(actualPerson)
            }
        }
        if (message.includes("hors ligne")) {
            console.log(actualPerson + " not here" )
            if (obesePerson.includes(actualPerson)) {
                obesePerson.splice(actualPersonIndex, 1)

            }
        }
    }
})

/* LOGGER */
function log(message) {
    console.log("[" + bot.username + "]" + " : " + message)
}

/* ERROR HANDLER */
bot.on('kicked', console.log)
bot.on('error', console.log)

/* VIEWER */
bot.once('spawn', () => {
    mineflayerViewer(bot, { port: 3007, firstPerson: false })
})

/* API */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
    res.status(200).json({
        working: true,
        methods: ["getobese"]
    });
})

app.get("/api/:methods", (req, res) => {
    if(req.params.methods === "getobese") {
        res.status(200).json({
            success: true,
            obese: obesePerson
        });
    } else {
        res.status(404).json({
            success: false,
            error: "bad_methods",
            methods: ["getobese"]
        });
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}


app.listen(port)
