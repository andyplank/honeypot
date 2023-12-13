export const iconMap:any = {
    bear: "bear.svg",
    chicken: "chicken.svg",
    cat: "cat.svg",
    dog: "dog.svg",
    fox: "fox.svg",
    lion: "lion.svg",
    mouse: "mouse.svg",
    panda: "panda.svg",
    snake: "snake.svg",
    tiger: "tiger.svg",
    horse: "horse.svg",
    pig: "pig.svg",
    sheep: "sheep.svg",
    cow: "cow.svg"
}

const PlayerIcon = ({iconName, customClass}: {iconName: string, customClass?: string}) => {
    if (!iconMap[iconName]) {
        return <></>
    }

    const icon = iconMap[iconName];

    return (
        <img src={`./icons/${icon}`} alt={iconName} className={customClass}/>
    )
}

export default PlayerIcon;
