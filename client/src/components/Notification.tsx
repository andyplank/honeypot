import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

function Notification({text}: {text: string}) {

    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (text !== null && text !== "") {
            setMessages((prev:any) => prev.concat(text));
        }
    }, [text, setMessages]);

    const removeMessage = (index:number) => {
        setMessages((prev:any) => prev.filter((_:any, i:number) => i !== index));
    }


    // TODO: fix notifications

    return (
    <>
        <div className='bg-purple fixed top-10 left-20 text-white  w-200px rounded'>
        {messages.map((message:string, idx:number) => {
        return (
            <div key={`${idx}-notification`} className=''>
                <Transition
                    show={true}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="flex justify-between">
                        <div className='flex justify-start self-center'>
                        {message}
                        </div>
                        <button className='flex self-center justify-end' onClick={() => removeMessage(idx)}>
                            <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
                        </button>
                    </div>

                </Transition>
            </div>
        )
      })}
      </div>
    </>
  )
}

export default Notification;