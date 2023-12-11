import {useState} from 'react';
import { Player } from './Player';
import bear from '../images/icons/bear.svg';
import chicken from '../images/icons/chicken.svg';

function PlayerIcon({iconString}: {iconString: string}) {

    const iconMap:any = {
        bear: bear,
        chicken: chicken
    }

    if (!iconMap[iconString]) {
        return <></>
    }

    const icon = iconMap[iconString];

    return (
        <div className="p-4">
            <img src={icon} />
        </div>
    )
}

export default PlayerIcon;