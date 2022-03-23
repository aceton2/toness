import { Oscillator, Player, Transport } from 'tone';

const osc = new Oscillator().toDestination();
const player = new Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();

Transport.bpm.value = 160;
Transport.loop = true;
Transport.loopStart = "0:0:0"
Transport.loopEnd = "4:0:0"

Transport.scheduleRepeat((time) => {
    osc.start(time).stop(time + 0.1)
}, "1m")

// repeated event every 8th note
Transport.schedule((time) => {
    // use the callback time to schedule events
    player.start(time)
}, "0:1:0");
// transport must be started before it starts invoking events

function start() {
    Transport.start();
}

function stop() {
    Transport.stop();
}

export default {
    start: start,
    stop: stop
}