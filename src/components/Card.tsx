interface CardProps {
    title: string;
    value: number;
}
export const Card: React.FC<CardProps> = ({ title, value }) => {
    return (
        <div className="
        bg-gray-100 p-3 rounded-lg shadow 
        flex flex-col items-center
        xl:w-[48%]
        border-3 
        border-[#328DD8]
        shadow-md
        shadow-black
      ">
        <p className="text-xs sm:text-sm md:text-base whitespace-nowrap">{title}</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold">{value}</p>
      </div>
    )
}