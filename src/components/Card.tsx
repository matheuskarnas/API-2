interface CardProps {
    title: string;
    value: number;
    onClick?: () => void;
}
export const Card: React.FC<CardProps> = ({ title, value, onClick }) => {
    return (
        <div 
        onClick={onClick}
        className="
        bg-wite p-3 rounded-lg shadow 
        flex flex-col items-center
        xl:w-[48%]
        border-3 
        border-[#328DD8]
        shadow-md
        shadow-black
        cursor-pointer
      ">
        <p className="text-xs sm:text-sm md:text-base whitespace-nowrap">{title}</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold">{value}</p>
      </div>
    )
}