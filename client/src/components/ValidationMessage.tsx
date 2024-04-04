import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react';

function ValidationMessage({text, show, setShow}: {text: string, show: boolean, setShow: any}) {

    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (text !== null && text !== "" && text !== undefined) {
            setMessage(text);
            setShow(true);
        }
    }, [text, setMessage, message]);

    const title = "Error!";
    const body = message;

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
            >
            <div className="absolute rounded bg-red-300">
                <div className="px-4 py-2 rounded flex items-center" role="alert">
                    <p className="grow">
                        <span className="font-bold pr-2 ">{title}</span>
                        <span className="text-sm">{body}</span>
                    </p>
                </div>
            </div>
            </Transition>
      </div>
  )
}

export default ValidationMessage;