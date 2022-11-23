
function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


const app = Vue.createApp({
    data() {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        }
    },

    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = randomValue(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = randomValue(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttack() {
            this.currentRound++;
            const attackValue = randomValue(12, 19);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'specialAttack', attackValue);
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = randomValue(10, 17);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        startNewGame() {
            this.monsterHealth = 100;
            this.playerHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        surrender() {
            this.winner = 'monster';
            this.addLogMessage('player', 'surrender', 0);
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        }
    },

    computed: {
        monsterBarStyle() {
            if (this.monsterHealth <= 0) {
                return { width: '0%' }
            }
            return { width: this.monsterHealth + '%' }

        },
        playerBarStyle() {
            if (this.playerHealth <= 0) {
                return { width: '0%' }
            }
            return { width: this.playerHealth + '%' }

        },
        mayUseSpecialAttack() {
            // return为true时按钮不可按
            return (this.currentRound % 3 !== 0)
        },
        mayUseHeal() {
            return (this.currentRound % 2 !== 0)
        }
    },

    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // a draw
                this.winner = 'draw';
                this.addLogMessage(this.winner, 'win', 0);
            } else if (value <= 0) {
                // player lost
                this.winner = 'monster';
                this.addLogMessage(this.winner, 'win', 0);
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // a draw
                this.winner = 'draw';
                this.addLogMessage(this.winner, 'win', 0);
            } else if (value <= 0) {
                // monster lost
                this.winner = 'player';
                this.addLogMessage(this.winner, 'win', 0);
            }
        }
    }
});
app.mount('#game')