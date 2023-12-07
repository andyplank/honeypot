import { Disclosure,  } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Logo from '../images/Logo.png'

const Header = ({roomCode}: {roomCode:string}) => {
  return (
    <>
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="px-2">
            <div className="relative flex h-32 items-center justify-between">             
              <div className="flex flex-1 items-center sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                    <a href="/">
                        <img
                            className="h-48 w-auto"
                            src={Logo}
                            alt="Things and Strings"
                        />
                    </a>
                </div>
              </div>
              {roomCode !== "" && 
              <div className="flex items-center pr-10 sm:static sm:ml-6">
                <p>Room Code: {roomCode}</p>
              </div>}
            </div>
          </div>

        </>
      )}
    </Disclosure>
    <div className='py-4 bg-purple' />
    </>
  )
}

export default Header;