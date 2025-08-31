import { Link } from "react-router-dom"

const VerMasButton = () => {

    return(
        <button className="bg-amber-400 w-32 h-10 text-xl font-bold rounded-3xl flex justify-center items-center my-3">
            <Link to="/productos">
                <p> Ver mas</p>
            </Link>            
        </button>
    )
}

export default VerMasButton