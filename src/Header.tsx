const Header = () => {
  return (
    <header className="text-gray-800 body-font bg-gradient-to-t from-light-blue to-sky-blue">
      <div className="container mx-auto flex flex-wrap p-5 flex-row items-center">
        <a onClick={() => window.location.href = "/"} className="z-10 cursor-pointer flex title-font font-medium items-center text-gray-900 mt-1 mb-4 md:mb-0">
          <img className="lg:w-16 w-10  object-cover object-center rounded-full border border-gray-300 shadow-lg" alt="king yeti" src="/king-yeti.png" />
        </a>
        <nav className="ml-auto flex flex-wrap items-center text-base justify-center">
        </nav>
        <button onClick={() => window.open("https://twitter.com/metamounts")} className="z-10 inline-flex items-center bg-transparent border-0 px-2 focus:outline-none rounded text-base">
          <svg fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" className="w-8 h-8 lg:w-11 lg:h-11 ml-1" viewBox="0 0 20 20">
            <path d="M17.316 6.246c.008.162.011.326.011.488c0 4.99-3.797 10.742-10.74 10.742c-2.133 0-4.116-.625-5.787-1.697a7.577 7.577 0 0 0 5.588-1.562a3.779 3.779 0 0 1-3.526-2.621a3.858 3.858 0 0 0 1.705-.065a3.779 3.779 0 0 1-3.028-3.703v-.047a3.766 3.766 0 0 0 1.71.473a3.775 3.775 0 0 1-1.168-5.041a10.716 10.716 0 0 0 7.781 3.945a3.813 3.813 0 0 1-.097-.861a3.773 3.773 0 0 1 3.774-3.773a3.77 3.77 0 0 1 2.756 1.191a7.602 7.602 0 0 0 2.397-.916a3.789 3.789 0 0 1-1.66 2.088a7.55 7.55 0 0 0 2.168-.594a7.623 7.623 0 0 1-1.884 1.953z"></path>
          </svg>
        </button>
        <button onClick={() => window.open("https://discord.gg/")} className="z-10 inline-flex items-center bg-transparent border-0 pl-3 focus:outline-none rounded text-base">
          <svg fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" className="w-8 h-8 lg:w-11 lg:h-11 ml-1" viewBox="0 0 16 16">
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011a.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0a8.258 8.258 0 0 0-.412-.833a.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02a.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059a.051.051 0 0 0-.018-.011a8.875 8.875 0 0 1-1.248-.595a.05.05 0 0 1-.02-.066a.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085a8.254 8.254 0 0 1-1.249.594a.05.05 0 0 0-.03.03a.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019a13.235 13.235 0 0 0 4.001-2.02a.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612c0-.889.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613c0 .888-.637 1.612-1.438 1.612zm5.316 0c-.788 0-1.438-.724-1.438-1.612c0-.889.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613c0 .888-.631 1.612-1.438 1.612z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;