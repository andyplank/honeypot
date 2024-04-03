import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Help({open, setOpen, title, text}: {open: boolean, setOpen: any, title: string, text: string}) {

    return (
    <Transition.Root 
      show={open} 
      as={Fragment}
    >
      <Dialog as="div" className="relative" onClose={setOpen}>
        <div className="fixed inset-0 z-10 w-dvw h-dvh">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all border-4 border-purple sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                        <h4>{title}</h4>
                      </Dialog.Title>
                      <XMarkIcon type="button" onClick={() => setOpen(false)} className="cursor-pointer h-7 w-7 absolute right-2 top-2" aria-hidden="true" />
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            {text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}