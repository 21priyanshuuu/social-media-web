import React from 'react'; 

const Navbar = () => {
  return (
    <div className="flex flex-row rounded h-12 bg-gradient-to-t from-black to-zinc-500">
      <div >
      <div className="flex flex-col justify-center items-center ml-80">
            <p className='font-bold	italic text-white'>LightShot</p>
            <p className='text-white text-xs'>screen capture tool</p>
        </div>
      </div>
      <nav className="navbar">
        <ul>
          <li><a href="#home"></a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
