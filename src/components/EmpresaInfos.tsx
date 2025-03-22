import { empresa } from "../../public/data/empresa";

export function EmpresaInfos(){
    return(
        <div className="p-6 w-full max-w-md text-center bg-white rounded-lg mt-4">
        <img
          src={`/public/assets/${empresa.highSponsorLogo}`}
          alt="Loggi Logo"
          className="w-32 h-32 mx-auto p-2 rounded-md"
        />
        <p className="mt-4 text-gray-700">
         {empresa.descriptionSponsor}
        </p>
      </div>
    )
}