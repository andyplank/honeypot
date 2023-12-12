import Logo from '../images/Logo.png'

const Header = ({roomCode}: {roomCode:string}) => {

const roomCodeUpper = roomCode.toUpperCase();

  return (
    <>
      <div className="px-2 h-[130px]">
        <div className="flex h-32 items-center justify-between">             
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
            <p>Room Code: {roomCodeUpper}</p>
          </div>}
        </div>
      </div>
    <div className='py-[10px] bg-purple' />
    </>
  )
}

export default Header;