import { Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

export default function Spin() {
    let [isShowing, setIsShowing] = useState(false)
    let [hidden, isHidden] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setIsShowing(true);
        },1000);   
        setTimeout(() => {
            setIsShowing(false);
        },2000);
        setTimeout(() => {
            isHidden(true);
        },3200);
    }, []);

    if (hidden) return (<></>);

    return (
        <div className="h-screen w-screen z-40 bg-white fadeAway flex fixed items-center justify-center transistion-opacity ease-in-out duration-300 delay-[2000ms]">
            <div className="h-32 w-32">
                <Transition
                as={Fragment}
                show={isShowing}
                enter="transform transition duration-[400ms]"
                enterFrom="opacity-0 rotate-[-120deg] scale-50"
                enterTo="opacity-100 rotate-0 scale-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100 rotate-0 scale-100 "
                leaveTo="opacity-0 scale-95 "
                >
                    <img src={`./honey.png`} alt={"honey"} />
                </Transition>
            </div>
        </div>
    )
}
