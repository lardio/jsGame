class Mouvement {
    constructor (emplacementDOM, frameX, frameY, baseX, baseY) {
        this.bloc = emplacementDOM;;
        this.frameY = frameY;
        this.frameX = frameX;
        this.baseX = baseX;
        this.baseY = baseY;
    }

    animationDecalage = (propriete, valeur) => {
        this.bloc.propriete = valeur;
    }
}

const test9 = new Mouvement()