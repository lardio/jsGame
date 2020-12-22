class Mage {
    constructor (nom, emplacement) {
        this.nom = nom;
        this.emplacementDOM = emplacement;
        this.frameY = 138;
        this.frameX = 150;
        this.interval = 600;
        this.anim = true;
        this.decalageX = 3;
        this.animationPerso;
    }

    start = () =>  {
        this.anim = true;
        this.animationPerso = setInterval(this.moove, this.interval);
    }

    stop = () =>  {
        this.anim = false;
        clearInterval(this.animationPerso);}

    moove = () => {
        this.emplacementDOM.style.backgroundPosition = `-${this.decalageX}px  ${this.frameY}px`; 
        this.decalageX == 153 ? this.decalageX = 3 : this.decalageX = 153;
    }



    /*
        @image frame a afficher
    */
    modificationFrame = (image) => {
        let newBackgroundPosition = -3 + (-150 * image) + "px 138px";
        this.emplacementDOM.style.backgroundPosition = newBackgroundPosition;
    }

    /*
        @frame frame a afficher
        @timeRanger valeur a affecter au setTimeout qui correspond au delai avant la prochaine animation
    */
    animateFrame = (frame, timeRange) => {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    this.modificationFrame(frame);
                    resolve(frame);
                }, timeRange)
            } catch(error) {
                reject(error);
            }
        })
    }

    //affichage uniquement du baton, sans animation
    affichageUniquementBatton = () => {
        return new Promise ((resolve, reject) => {
            try {
                let conteneurBatton = document.createElement("p");
                this.emplacementDOM.appendChild(conteneurBatton);
                conteneurBatton.classList.add("batton");
                resolve(conteneurBatton);
            }catch (error) {
                reject(error);
            }
        })
    }

    //affichage uniquement boule de feu sans animation
    affichageBoulefeu = () => {
        return new Promise ((resolve, reject) => {
            try {
                let conteneurFeu = document.createElement("div");
                this.emplacementDOM.appendChild(conteneurFeu);
                conteneurFeu.classList.add("fire");
                resolve(conteneurFeu);
            }catch (error) {
                reject(error);
            }
        })
    }

    //mouvement de la boule de feu, disparait a la @limiteAnimation
    mouvementBouleFeu = (feu) => {
        const vitesse = 39;
        const delaiAnimation = 50;
        const limiteAnimation = 820;
        return new Promise ((resolve, reject) => {
            const feuPosition = feu.getBoundingClientRect();
            let newPosition = feuPosition.left;
            let lancement = setInterval(() => {
                newPosition = newPosition + vitesse;
                feu.style.left = newPosition + "px";
                if (newPosition > limiteAnimation) {
                    clearInterval(lancement);
                    this.reactionEnnemi();
                    feu.style.display = "none";
                    resolve(true);
                }
            }, delaiAnimation)
        })
    }

    reactionEnnemi = () => {
        const reactions = ["Mécréaaaaaant !!!", "Le gras c’est la vie !", "On en a gros !", "Elle est ou la poulette" , "PAYS DE GALLE INDÉPENDAAAAAAAAAAAAAAAAAAAANT" , "Et toc, remonte ton slibar, Lothar !", "La fleur au soleil fane…", "Cœur à l’ouvrage n’a pas fière allure."];
        let reaction = reactions[Math.floor(Math.random() * reactions.length)];
        let insulte = document.querySelector(".insulte");
        insulte.textContent = reaction;
        insulte.style.display = "block";
        setTimeout(() => insulte.style.display = "none", 1000);
    }

    //mouvement attaque du batton; aller et retour
    mouvementBattonAttaque = (batton) => {
        return new Promise ((resolve, reject) => {
            let start = 89;
            let moveX = 50;
            let dirB = true;
            let reactionDone = false;
            let movba = setInterval(() => {
                
                batton.style.left = (moveX + start) + "px";
                if (start < 700 && dirB) {
                    start = start + moveX;
                } else {
                    dirB = false;
                    moveX  = 70;
                    start = start - moveX;
                    if(!reactionDone) {
                        this.reactionEnnemi();
                        reactionDone = true;
                    }
                }
                if(!dirB && start <= -100) {
                    clearInterval(movba);
                    batton.style.display = "none";
                    resolve(true);
                }
            }, 50);
        })
    }

    /*
        Animation de l'attaque via le lance du batton
    */
    async attaqueBatton () {
        this.stop();
        Sylvain.disableActions(true);
        const frame = [2, 3, 4, 5, 1];
        const delay = [50, 50, 50, 50, 50, 100];
        for(let index in frame) {            
            if(frame[index] === 5) {
                //lancement de l'animation du batton
                await this.animateFrame(frame[index], delay[index]);
                let c = await this.affichageUniquementBatton();
                await this.mouvementBattonAttaque(c);
            }else {
                await this.animateFrame(frame[index], delay[index]);
            }
            
        }
        Sylvain.disableActions(false);
        this.start();
    }

    //lancement de lattaque complete avec boule feu
    async attaqueFire () {
        this.stop();
        Sylvain.disableActions(true);
        const frame = [2, 1];
        const delay = [50, 100];
        for(let index in frame) {  
            if (frame[index] === 2) {
                await this.animateFrame(frame[index], delay[index]);
                let feu = await this.affichageBoulefeu();
                let c = await this.mouvementBouleFeu(feu);
            } else {
                await this.animateFrame(frame[index], delay[index]);
            }
        }
        Sylvain.disableActions(false);
        this.start();
    }

    disableActions = (choix) => {
        const buttonsActions = document.querySelectorAll("button");
        buttonsActions.forEach(button => {
            console.log(choix);
            if(choix === true) {
                  button.setAttribute("disabled", "");
            } else {
                button.removeAttribute("disabled", "");
            }
        });
        

    }
}

const Sylvain = new Mage("Sylvain", document.querySelector("#image2"));
Sylvain.start();

coupBaton.addEventListener("click", function() {
    Sylvain.attaqueBatton();
})
bouleFeu.addEventListener("click", function() {
    Sylvain.attaqueFire();
})
