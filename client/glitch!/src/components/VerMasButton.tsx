import { Link } from "react-router-dom"

const VerMasButton = () => {

    return(
        <button className="bg-blue-500 text-white hover:bg-blue-600 w-32 h-10 rounded-lg flex justify-center items-center my-3">
            <Link to="/productos">
                <p> Ver mas</p>
            </Link>            
        </button>
    )
}

export default VerMasButton