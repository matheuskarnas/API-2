import { empresa } from "../../public/data/empresa";

export function EmpresaInfos() {
  return (
    <div className="w-full xl:w-[70%] mx-auto bg-white rounded-lg  flex flex-col xl:flex-row items-center text-center xl:text-left p-4">
      <img
        src={`/assets/${empresa.highSponsorLogo}`}
        alt="Loggi Logo"
        className="w-40 h-40 sm:w-60 sm:h-60 md:w-70 md:h-70 rounded-md"
      />
      <p className=" xl:mt-0 xl:ml-8 text-gray-700">
        {empresa.descriptionSponsor}
      </p>
    </div>
  );
}