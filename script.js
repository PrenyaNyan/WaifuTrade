if(window.screen.width<1270){
	document.getElementById("input").classList.remove('pc')
	document.getElementById("imgPseudo").classList.add('phone')
	document.getElementById("imgMyID").classList.add('phone')
	document.getElementById("imgHisID").classList.add('phone')
}

var favwaifus = []
var Mywaifulist = {}
var Hiswaifulist = {}

var cooldown = 0
var nav = 1
var anipass = 1
var display = []
var waitpage = 1
var previouspseudo = null
var prevmyDID = null
var prevyourDID = null
var err = 0

var common = {}
var hisuncommon = {}
var myuncommmon = {}
var pepite = {}
var noname = {}

let urlempty = 'https://cdn.discordapp.com/attachments/837007193546817581/851867900398796800/unknown.png'
let urlerror = 'https://cdn.discordapp.com/attachments/837007193546817581/851865474777481286/Sans_titre-1_-_Copie.png'
let urlloading = 'https://media1.giphy.com/media/L05HgB2h6qICDs5Sms/giphy.gif'
let urlvalidate = 'https://cdn.discordapp.com/attachments/837007193546817581/851871859087245332/565-5650947_tick-mark-symbol-icon-transparent-background-green-check.png'

async function Validerbtn() {
	anipass = 1
	err = 0
	document.getElementById("comboA").innerHTML = ''
	document.getElementById("Outputtext").innerHTML = ''
	document.getElementById("wrappercard").innerHTML = ''
	document.getElementById("imgPseudo").src=urlempty;
	document.getElementById("imgMyID").src=urlempty;
	document.getElementById("imgHisID").src=urlempty;

	if(cooldown == 0){
		var chb = document.getElementById('checkboxPseudo')
		let inputpseudo = String(document.getElementById('EnterPseudo').value)
		
		if (chb.checked){
			if(inputpseudo.length == 0){
				document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += 'Error Pseudo input is empty !!<br>'
				document.getElementById("imgPseudo").src=urlerror;
				anipass = 1
			}else{
				anipass = 0
			}
		}
		else{
			document.getElementById("Outputtext").innerHTML = ''
		}

		let inputMyID = String(document.getElementById('EnterMyID').value)
		if (inputMyID.length == 0){
			document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += 'Error Your Discord ID input is empty !!<br>'
			document.getElementById("imgMyID").src=urlerror;
		}
		else{
			document.getElementById("Outputtext").innerHTML = ''
			var mylist = 1
		}

		let inputHisID = String(document.getElementById('EnterHisID').value)
		if (inputHisID.length == 0){
			document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += 'Error His Discord ID input is empty !!<br>'
			document.getElementById("imgHisID").src=urlerror;

		}
		else{
			document.getElementById("Outputtext").innerHTML = ''
			var yourlist = 1
		}

		
		if(mylist == 1 && yourlist ==1){
			cooldown = 1
			document.getElementById("Outputtext").innerHTML = ''

			if(anipass == 0){
				document.getElementById("imgPseudo").src=urlloading;
				await StartFav(inputpseudo)
							
				}

			document.getElementById("imgMyID").src=urlloading;
			await StartMylist(inputMyID)
			document.getElementById("imgHisID").src=urlloading;
			await StartHislist(inputHisID)
			
			if(err == 0){
				compare()
			}
		
		}
	}
}


const FavQuery = `
query($username: String, $page: Int) {
    User(name: $username) {
        favourites {
            characters(page: $page, perPage: 50) {
                nodes {
                    id
                    name {
                        full
                    }
                }
            }
        }
    }
}
`

async function GetFavorites(user, page) {

	return await fetch('https://graphql.anilist.co/', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		query: FavQuery,
		variables: {
			username: user,
			page: page,
		},
		}),
	})
}

async function StartFav(inputpseudo) {
	if(inputpseudo != previouspseudo){
		try{
			favwaifus = []
			var long0 = 0
			var stop = 0
			var b = 0

			while(stop == 0){
				b = b+1
				let reapi = GetFavorites(inputpseudo,b)
				await reapi.then((a) => printa(a))
				if(favwaifus.length == long0){
					stop = 1
					document.getElementById("imgPseudo").src=urlvalidate;
					cooldown = 0
				}
				long0 = favwaifus.length
			}
		}catch{
			document.getElementById("imgPseudo").src=urlerror;
			document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += 'This Pseudo does not exist.<br>'

			cooldown = 0
			mylist == 0
		}
	}else{
		document.getElementById("imgPseudo").src=urlvalidate;
	}
	previouspseudo = inputpseudo
}

async function printa(a){
	let response = await a.json()
	var waifu = response.data.User.favourites.characters.nodes
	
	for (i = 0; i < waifu.length; i++) {
		favwaifus.push(waifu[i].id.toString())
	}
}

async function StartHislist(DID){
	if(DID != prevyourDID){
		try{
			Hiswaifulist = {}
			let waifuinfo = await GetList(DID)
			
			for (j = 0; j < waifuinfo.length; j++) {
				Hiswaifulist[waifuinfo[j].id.toString()] = [waifuinfo[j].image,waifuinfo[j].name]
				
			}
			document.getElementById("imgHisID").src=urlvalidate;
			}catch(error){
				console.log(error)
				document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += 'This ID does not exist.<br>'
				document.getElementById("imgHisID").src=urlerror;
				err = 1
				cooldown = 0
			}
		}else{
			document.getElementById("imgHisID").src=urlvalidate;
		}
	if(err == 0){
		prevyourDID = DID
	}
	
}

async function StartMylist(DID){
	if(DID != prevmyDID){
		try{
			Mywaifulist = {}
			let waifuinfo = await GetList(DID)
			for (j = 0; j < waifuinfo.length; j++) {
				Mywaifulist[waifuinfo[j].id.toString()] = [waifuinfo[j].image,waifuinfo[j].name]
			}

			document.getElementById("imgMyID").src=urlvalidate;
		}catch(error){
			console.log(error)
			document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += 'This ID does not exist.<br>'
			document.getElementById("imgMyID").src=urlerror;
			err = 1
			cooldown = 0
		}
	}else{
		document.getElementById("imgMyID").src=urlvalidate;
	}
	if(err == 0){
		prevmyDID = DID
	}
}

async function GetList(DID){
	let waifurep = await fetch('https://waifuapi.kar.moe/user/'+DID)
	let parsed = await waifurep.json()
	let waifuinfo = parsed.waifus
	return waifuinfo

}


function compare(){
	commmon()
	Myuncommmon()
	console.log()
	document.getElementById("comboA").innerHTML = `<option value="1">Detail</option><option value="2">Common (${Object.keys(common).length})</option><option value="3">His uncommon (${Object.keys(hisuncommon).length})</option><option value="4">My Uncommon (${Object.keys(myuncommmon).length})</option>`
	if (favwaifus.length > 0){
		findpepite()
		findnoname()
		document.getElementById("comboA").innerHTML = comboA.innerHTML += `<option value="5">Fav Found (${Object.keys(pepite).length})</option><option value="6">No Name (${Object.keys(noname).length})</option>`
	}
	waitpage = 0
	displaylist(nav)
}

function commmon(){
	common = {}
	hisuncommon = {}
	for (s = 0; s < Object.keys(Mywaifulist).length  ; s++) {
		if((Hiswaifulist.hasOwnProperty(Object.keys(Mywaifulist)[s])) == true){

			common[Object.keys(Mywaifulist)[s]] = [Mywaifulist[Object.keys(Mywaifulist)[s]][0],Mywaifulist[Object.keys(Mywaifulist)[s]][1]]
		}
		else{
			hisuncommon[Object.keys(Mywaifulist)[s]] = [Mywaifulist[Object.keys(Mywaifulist)[s]][0],Mywaifulist[Object.keys(Mywaifulist)[s]][1]]
		}
	}
	cooldown = 0
}

function Myuncommmon(){
	myuncommmon = {}
	for (s = 0; s < Object.keys(Hiswaifulist).length  ; s++) {
		if((Mywaifulist.hasOwnProperty(Object.keys(Hiswaifulist)[s])) == false){

			myuncommmon[Object.keys(Hiswaifulist)[s]] = [Hiswaifulist[Object.keys(Hiswaifulist)[s]][0],Hiswaifulist[Object.keys(Hiswaifulist)[s]][1]]
		}
	}
	cooldown = 0
}

function findpepite(){
	pepite = {}
	for (g = 0; g < favwaifus.length  ; g++) {
		if(Hiswaifulist.hasOwnProperty(favwaifus[g]) == true && Mywaifulist.hasOwnProperty(favwaifus[g]) == false){
			pepite[favwaifus[g]] = [Hiswaifulist[favwaifus[g]][0],Hiswaifulist[favwaifus[g]][1]]
		}
	}
}

function findnoname(){
	noname = {}
	for (f = 0; f < Object.keys(hisuncommon).length ; f++) {
		if(favwaifus.includes(Object.keys(hisuncommon)[f]) == false){

			noname[Object.keys(hisuncommon)[f]] = [hisuncommon[Object.keys(hisuncommon)[f]][0],hisuncommon[Object.keys(hisuncommon)[f]][1]]
		}
	}
}

function displaylist(num){
	display = []
	document.getElementById("wrappercard").innerHTML = ''
	document.getElementById("Outputtext").innerHTML = ''

	if(num == 1){
		document.getElementById("Outputtext").innerHTML = Outputtext.innerHTML += `Common :<br>Personnages en commun avec la personne.<br><br>His Uncommon :<br>Personnage que la personne n'a pas dans votre liste (Utile pour Billy).<br><br>My Uncommon :<br>Personnage que vous n'avez pas dans la liste de la personne.<br><br>Fav Found :<br>Favoris Anilist trouvé dans la liste de la personne.<br><br>No Name :<br>Version amélioré de His Uncommon avec vos favoris Anilist en moins.`
	}
	if(num == 2){
		for (f = 0; f < Object.keys(common).length ; f++) {
			display += `
				<div class=\"card\">
				<a href=\"https://anilist.co/character/${Object.keys(common)[f]}\" target=\"_blank\">
					<img src=\"${common[Object.keys(common)[f]][0]}" class="perso">
				</a>
					<p>${common[Object.keys(common)[f]][1]}</p>
					<p>${Object.keys(common)[f]}</p>
				</div>`
		}
		document.getElementById("wrappercard").innerHTML = wrappercard.innerHTML = display
	}
	if(num == 3){
		for (f = 0; f < Object.keys(hisuncommon).length ; f++) {
			display += `
				<div class=\"card\">
				<a href=\"https://anilist.co/character/${Object.keys(hisuncommon)[f]}\" target=\"_blank\">
					<img src=\"${hisuncommon[Object.keys(hisuncommon)[f]][0]}" class="perso">
				</a>
					<p>${hisuncommon[Object.keys(hisuncommon)[f]][1]}</p>
					<p>${Object.keys(hisuncommon)[f]}</p>
				</div>`
		}
		document.getElementById("wrappercard").innerHTML = wrappercard.innerHTML = display
	}
	if(num == 4){
		for (f = 0; f < Object.keys(myuncommmon).length ; f++) {
			display += `
				<div class=\"card\">
				<a href=\"https://anilist.co/character/${Object.keys(myuncommmon)[f]}\" target=\"_blank\">
					<img src=\"${myuncommmon[Object.keys(myuncommmon)[f]][0]}" class="perso">
				</a>
					<p>${myuncommmon[Object.keys(myuncommmon)[f]][1]}</p>
					<p>${Object.keys(myuncommmon)[f]}</p>
				</div>`
		}
		document.getElementById("wrappercard").innerHTML = wrappercard.innerHTML = display
	}
	if(num == 5){
		for (f = 0; f < Object.keys(pepite).length ; f++) {
			display += `
				<div class=\"card\">
				<a href=\"https://anilist.co/character/${Object.keys(pepite)[f]}\" target=\"_blank\">
					<img src=\"${pepite[Object.keys(pepite)[f]][0]}" class="perso">
				</a>
					<p>${pepite[Object.keys(pepite)[f]][1]}</p>
					<p>${Object.keys(pepite)[f]}</p>
				</div>`
		}
		document.getElementById("wrappercard").innerHTML = wrappercard.innerHTML = display
	}
	if(num == 6){
		for (f = 0; f < Object.keys(noname).length ; f++) {
			display += `
				<div class=\"card\">
					<a href=\"https://anilist.co/character/${Object.keys(noname)[f]}\" target=\"_blank\">
						<img src=\"${noname[Object.keys(noname)[f]][0]}" class="perso">
					</a>
					<p>${noname[Object.keys(noname)[f]][1]}</p>
					<p>${Object.keys(noname)[f]}</p>
				</div>`
		}
		document.getElementById("wrappercard").innerHTML = wrappercard.innerHTML = display
	}
	waitpage = 0
}
