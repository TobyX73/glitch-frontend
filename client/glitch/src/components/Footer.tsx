
const Footer = () => {
    return(
        <footer className="bg-gris text-white py-12">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                    <div>
                        <h3 className="text-xl font-bold mb-4">Redes sociales</h3>
                        <a 
                            href="https://www.instagram.com/glitch.urbanclothes/?hl=es" 
                            className="inline-flex items-center gap-3 transition-opacity duration-300 hover:opacity-70">
                            <img 
                                src="/logo-instagram.svg" 
                                alt="Instagram" 
                                className="h-10 w-10"
                            />
                        </a>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contacto</h3>
                        <a 
                            href="mailto:glitchurbanstore@gmail.com"
                            className="transition-colors duration-300 hover:text-verde"
                        >
                            glitchurbanstore@gmail.com
                        </a>
                    </div>

                    <div className="flex items-start justify-start md:justify-end">
                        <button className="border-2 border-white px-6 py-3 transition-colors duration-300 hover:bg-white hover:text-gris font-medium">
                            <h1>Botón de arrepentimiento </h1>                        
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6 text-center">
                    <p className="text-sm">
                        GLITCHURBANSTORE.COM. ALL RIGHTS RESERVED
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer