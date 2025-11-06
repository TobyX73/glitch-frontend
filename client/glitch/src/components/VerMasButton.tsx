import { Link } from "react-router-dom"

const VerMasButton = () => {

    return(
        <button className="bg-gris text-verde hover:bg-verde hover:text-gris transition-colors duration-300 border-verde border-2 w-40 h-10 flex justify-center items-center my-3 text-lg font-medium">
            <Link to="/productos">
                <h1> Ver más</h1>
            </Link>            
        </button>
    )
}

export default VerMasButton