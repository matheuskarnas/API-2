export function Stats(){
    return(
        <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
        <div className="bg-gray-200 p-4 rounded-xl shadow-md ">
          <p className="text-xs text-black">Número de lojas criadas:</p>
          <p className="text-2xl text-black font-bold">177</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-xl shadow-md ">
          <p className="text-xs text-black">Famílias impactadas:</p>
          <p className="text-2xl text-black font-bold">111</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-xl shadow-md ">
          <p className="text-xs text-black">Cidades impactadas:</p>
          <p className="text-2xl text-black font-bold">5</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-xl shadow-md ">
          <p className="text-xs text-black">Comunidades impactadas:</p>
          <p className="text-2xl text-black font-bold">54</p>
        </div>
      </div>
    )
}