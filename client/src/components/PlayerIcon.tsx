import bear from '../assets/bear-opt.svg';
import cat from '../assets/cat-opt.svg';
import chicken from '../assets/chicken-opt.svg';
import dog from '../assets/dog-opt.svg';
import fox from '../assets/fox-opt.svg';
import lion from '../assets/lion-opt.svg';
import mouse from '../assets/mouse-opt.svg';
import panda from '../assets/panda-opt.svg';
import snake from '../assets/snake-opt.svg';
import tiger from '../assets/tiger-opt.svg';
import horse from '../assets/horse-opt.svg';
import pig from '../assets/pig-opt.svg';
import sheep from '../assets/sheep-opt.svg';
import cow from '../assets/cow-opt.svg';
import monkey from '../assets/monkey-opt.svg';

export const iconMap:any = {
    bear: bear,
    cat: cat,
    chicken: chicken,
    dog: dog,
    fox: fox,
    lion: lion,
    mouse: mouse,
    panda: panda,
    snake: snake,
    tiger: tiger,
    horse: horse,
    pig: pig,
    sheep: sheep,
    cow: cow,
    monkey: monkey,
}

const PlayerIcon = ({iconName, customClass}: {iconName: string, customClass?: string}) => {
    if (!iconMap[iconName]) {
        return <></>
    }

    const icon = iconMap[iconName];

    return (
        <img src={'./icons/' + icon} alt={iconName} className={customClass} />
    )
}

export default PlayerIcon;
