import {useState} from 'react';
import { Player } from './Player';
import bear from '../images/icons/bear.svg';
import chicken from '../images/icons/chicken.svg';
import cat from '../images/icons/cat.svg';
import dog from '../images/icons/dog.svg';
import fox from '../images/icons/fox.svg';
import lion from '../images/icons/lion.svg';
import monkey from '../images/icons/monkey.svg';
import mouse from '../images/icons/mouse.svg';
import panda from '../images/icons/panda.svg';
import snake from '../images/icons/snake.svg';
import tiger from '../images/icons/tiger.svg';
import horse from '../images/icons/horse.svg';
import pig from '../images/icons/pig.svg';
import sheep from '../images/icons/sheep.svg';

export const iconMap:any = {
    bear: bear,
    chicken: chicken,
    cat: cat,
    dog: dog,
    fox: fox,
    lion: lion,
    monkey: monkey,
    mouse: mouse,
    panda: panda,
    snake: snake,
    tiger: tiger,
    horse: horse,
    pig: pig,
    sheep: sheep
}

function PlayerIcon({iconName}: {iconName: string}) {
    if (!iconMap[iconName]) {
        return <></>
    }

    const icon = iconMap[iconName];

    return (
        <div className="p-2 lg:p-4">
            <img src={icon} alt={iconName} />
        </div>
    )
}

export default PlayerIcon;
