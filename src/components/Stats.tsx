export function Stats(){
    return(
        <div className="grid grid-cols-2 gap-4  w-full max-w">
        <div className="bg-gray-200 p-4 ml-5  rounded-xl shadow-md lg:ml-14 md:ml-10 xl:ml-25 ">
          <p className="text-xs text-black">Número de lojas criadas</p>
          <p className="text-2xl text-black font-bold">177</p>
        </div>
        <div className="bg-gray-200 p-4 mr-5  rounded-xl shadow-md lg:mr-14 md:mr-10 xl:mr-25  ">
          <p className="text-xs text-black">Famílias impactadas:</p>
          <p className="text-2xl text-black font-bold">111</p>
        </div>
        <div className="bg-gray-200 p-4 ml-5  rounded-xl shadow-md lg:ml-14 md:ml-10 xl:ml-25">
          <p className="text-xs text-black">Cidades impactadas:</p>
          <p className="text-2xl text-black font-bold">5</p>
        </div>
        <div className="bg-gray-200 p-4 mr-5  rounded-xl shadow-md lg:mr-14 md:mr-10 xl:mr-25">
          <p className="text-xs text-black">Comunidades impactadas:</p>
          <p className="text-2xl text-black font-bold">54</p>
        </div>
      </div>
    )
}