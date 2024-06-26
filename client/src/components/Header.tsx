const Header = ({roomCode}: {roomCode:string}) => {

  const copyRoomCode = () => {
    const url = window.location.href;
    const copy = url.split('?')[0] + "?room=" + roomCode;
    navigator.clipboard.writeText(copy)
  }

  return (
      <header>
        <div className="flex justify-between h-100">             
          <div className="flex justify-start">
              <a href="/">
                  <img
                      className="h-[60px] md:h-[130px]"
                      src="/logo.png"
                      alt="Honeypot"
                  />
              </a>
          </div>
          {roomCode !== "" && 
          <div className="has-tooltip flex justify-end cursor-pointer" onClick={() => copyRoomCode()}>
            <span className='tooltip rounded shadow-lg p-1 m-1 bg-lightPurple text-center text-xs'>Click here to copy <br /> the game link!</span>
            <p className='self-end pb-1 pr-2 md:pb-4 md:pr-3 text-center'>Room Code:<br/> {roomCode}</p>
          </div>}
        </div>
        <div className='py-[5px] md:py-[10px] bg-purple' />
      </header>
  )
}

export default Header;