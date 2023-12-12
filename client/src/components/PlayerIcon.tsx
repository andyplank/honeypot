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

const PlayerIcon = ({iconName}: {iconName: string}) => {
    if (!iconMap[iconName]) {
        return <></>
    }

    const icon = iconMap[iconName];

    return (
        <div className="p-2 lg:p-4">
            <img src={`./icons/${icon}`} alt={iconName}/>
        </div>
    )
}

export default PlayerIcon;
