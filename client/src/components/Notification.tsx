import { Fragment, useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react';

function Notification({text}: {text: string}) {

    const [message, setMessage] = useState<string>("eee");
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (text !== null && text !== "" && text !== undefined) {
            setMessage(text);
            setTimeout(() => {
                setShow(true);
            }, 1);
            setTimeout(() => {
                setShow(false);
            }, 3000);
        } 
    }, [text, setMessage, message]);

    const msgs = message.split("!");
    const title = msgs[0] + "!";
    const body = msgs[1];
    const isCorrect = title === "Correct guess!"
    let classNames = "w-full mt-1 rounded ";
    if (isCorrect) {
        classNames += "bg-green";
    } else {
        classNames += "bg-red-300";
    }

    if (message === "") {
        return <></>
    }

    return (
        <div>
            <Transition
                as={Fragment}
                show={show}
                enter="ease-out duration-300"
                enterFrom="translate-y-10"
                enterTo="translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="-translate-y-0"
                leaveTo="translate-y-10"
            >
            <div className={classNames}>
                <div className="px-4 py-2 rounded flex items-center" role="alert">
                    <p className="grow">
                        <span className="font-bold pr-2 ">{title}</span>
                        <span className="text-sm">{body}</span>
                    </p>
                    <span onClick={() => setShow(false)}>
                        <XMarkIcon className="fill-current h-4 w-4" role="button" aria-hidden="true" />
                    </span>
                </div>
            </div>
            </Transition>
      </div>
  )
}

export default Notification;