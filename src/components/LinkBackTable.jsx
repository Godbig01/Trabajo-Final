import { FaArrowLeft } from "react-icons/fa";

export default function LinkTableReturn({ url }){
    return ( 
        <div class="text-center mt-7 mb-4">
            <a href={`/app/${url}`} class="text-blue-600 hover:border-b-2 hover:border-[#1e40af] hover:text-blue-800 text-[20px] mt-4 transition-colors duration-300 inline-flex gap-2 justify-center items-center">
            <FaArrowLeft size={18} />
                Volver
            </a>
        </div>
    )
}