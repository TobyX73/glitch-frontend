import { useState } from "react";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const VistaIndexContacto = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    try {
      // TODO: Reemplazar con endpoint real del backend
      console.log('Enviando formulario:', formData);
      
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      
      // Reset después de 5 segundos
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
      
      // Reset después de 5 segundos
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gris pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contáctanos</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ¿Tenés alguna pregunta o consulta? Completá el formulario y nos pondremos en contacto con vos a la brevedad.
          </p>
        </div>

        {/* Contenedor grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna izquierda - Información de contacto */}
          <div>
            <ContactInfo />
          </div>

          {/* Columna derecha - Formulario */}
          <div>
            <ContactForm onSubmit={handleSubmit} />

            {/* Mensaje de éxito */}
            {submitStatus === 'success' && (
              <div className="mt-6 p-4 bg-verde bg-opacity-10 border border-verde">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-verde flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-verde font-semibold">¡Mensaje enviado con éxito!</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Nos pondremos en contacto contigo pronto.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de error */}
            {submitStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-red-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-red-500 font-semibold">Error al enviar el mensaje</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Por favor, intentá nuevamente o contactanos directamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaIndexContacto;
