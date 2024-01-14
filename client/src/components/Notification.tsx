import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

function Notification({text}: {text: string}) {

    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (text !== null && text !== "") {
            setMessages((prev:any) => prev.concat(text));
            setTimeout(() => {
                removeMessage(0);
            }, 5000);
        } 
    }, [text, setMessages, messages]);

    const removeMessage = (index:number) => {
        setMessages((prev:any) => prev.filter((_:any, i:number) => i !== index));
    }

    // TODO: fix notifications

    return (
    <>
        <div className=''>
        {messages.map((message:string, idx:number) => {
        
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

        return (
            <div key={`${idx}-notification`} >
                <div className={classNames}>
                    <div className="px-4 rounded flex items-center" role="alert">
                        <strong className="font-bold pr-2">{title}</strong>
                        <span className="grow">{body}</span>
                        <span className="py-2" onClick={() => removeMessage(idx)}>
                            <XMarkIcon className="fill-current h-4 w-4" role="button" aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </div>
        )
      })}
      </div>
    </>
  )
}

export default Notification;