function Header() {
  return (
    <nav className="w-full bg-blue-900 p-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-bold ml-4">Loggi</h1>
      <div className="flex gap-3 mr-4">
          <a href={'#'} target="_blank" rel="noopener noreferrer">
            <img
              src={"../../public/assets/logotype.enc"}
              alt="Instagram"
              className="w-6 h-6"
            />
          </a>
        {/* {empresa.instagram && (
          <a href={empresa.instagram} target="_blank" rel="noopener noreferrer">
            <img
              src="../assets/instagram.png"
              alt="Instagram"
              className="w-6 h-6"
            />
          </a>
        )} */}
      </div>
    </nav>
  );
}

export default Header;
