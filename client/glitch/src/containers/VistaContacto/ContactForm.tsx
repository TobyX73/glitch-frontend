import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      // Limpiar formulario después de enviar
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-white font-medium mb-2">
          Nombre completo <span className="text-verde">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500 transition-colors"
          placeholder="Tu nombre"
        />
      </div>

      {/* Email y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email <span className="text-verde">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500 transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-white font-medium mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500 transition-colors"
            placeholder="+54 11 1234-5678"
          />
        </div>
      </div>

      {/* Asunto */}
      <div>
        <label htmlFor="subject" className="block text-white font-medium mb-2">
          Asunto <span className="text-verde">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde cursor-pointer transition-colors"
        >
          <option value="">Selecciona un asunto</option>
          <option value="consulta-producto">Consulta sobre producto</option>
          <option value="estado-pedido">Estado de mi pedido</option>
          <option value="cambio-devolucion">Cambios y devoluciones</option>
          <option value="colaboracion">Colaboración / Mayorista</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="block text-white font-medium mb-2">
          Mensaje <span className="text-verde">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-gris border border-gray-600 text-white rounded focus:outline-none focus:border-verde placeholder-gray-500 resize-none transition-colors"
          placeholder="Escribe tu mensaje aquí..."
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-gris border-2 border-verde text-verde font-semibold hover:bg-verde hover:text-gris transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : ' Enviar mensaje'}
      </button>
    </form>
  );
};

export default ContactForm;
