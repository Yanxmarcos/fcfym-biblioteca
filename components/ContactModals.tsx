'use client';
import { useState } from 'react';
import { Phone, MessageCircle, Mail, Send, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ContactInfo {
    phone: {
        fixed: string;
        mobile: string;
    };
    whatsapp: {
        number: string;
        link: string;
    };
    email: string;
    telegram: {
        number: string;
        link: string;
    };
    facebook: {
        page: string;
        previewImage: string;
    };
}
export const ContactModals = () => {
    const [openModal, setOpenModal] = useState<string | null>(null);
    const closeModal = () => setOpenModal(null);
    const contactInfo: ContactInfo = {
        phone: {
            fixed: '+51 44 223676',
            mobile: '+51 987654321  |  +51 987777332'
        },
        whatsapp: {
            number: '+51 987654321',
            link: 'https://wa.me/51987654321'
        },
        email: 'fcfym-biblioteca@unitru.edu.pe',
        telegram: {
            number: '@biblioteca_fcfm',
            link: 'https://t.me/biblioteca_fcfm'
        },
        facebook: {
            page: 'https://www.facebook.com/facultaddecienciasfisicasymatematicas',
            previewImage: '/img-fb.png'
        }
    };
    return (<>

            <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    ¡Contáctanos!
                </span>

                <div className="flex space-x-2" role="group" aria-label="Opciones de contacto">

                    <Button variant="ghost" size="sm" className="p-2 rounded-full text-gray-700 hover:text-[#F9A232] dark:text-gray-300 hover:bg-transparent ring-2 focus:ring-[#F9A232] focus:ring-opacity-50" aria-label="Contactar por teléfono" title="Llamar por teléfono" onClick={() => setOpenModal('phone')}>
                        <Phone className="w-5 h-5"/>
                    </Button>


                    <Button variant="ghost" size="sm" className="p-2 rounded-full text-gray-700 hover:text-[#F9A232] dark:text-gray-300 hover:bg-transparent ring-2 focus:ring-[#F9A232] focus:ring-opacity-50" aria-label="Contactar por chat" title="Abrir chat" onClick={() => setOpenModal('whatsapp')}>
                        <MessageCircle className="w-5 h-5"/>
                    </Button>


                    <Button variant="ghost" size="sm" className="p-2 rounded-full text-gray-700 hover:text-[#F9A232] dark:text-gray-300 hover:bg-transparent ring-2 focus:ring-[#F9A232] focus:ring-opacity-50" aria-label="Enviar correo electrónico" title="Enviar email" onClick={() => setOpenModal('email')}>
                        <Mail className="w-5 h-5"/>
                    </Button>


                    <Button variant="ghost" size="sm" className="p-2 rounded-full text-gray-700 hover:text-[#F9A232] dark:text-gray-300 hover:bg-transparent ring-2 focus:ring-[#F9A232] focus:ring-opacity-50" aria-label="Contactar por Telegram" title="Enviar mensaje por Telegram" onClick={() => setOpenModal('telegram')}>
                        <Send className="w-5 h-5"/>
                    </Button>


                    <Button variant="ghost" size="sm" className="p-2 rounded-full text-gray-700 hover:text-[#F9A232] dark:text-gray-300 hover:bg-transparent ring-2 focus:ring-[#F9A232] focus:ring-opacity-50" aria-label="Seguir en Facebook" title="Visitar página de Facebook" onClick={() => setOpenModal('facebook')}>
                        <Facebook className="w-5 h-5"/>
                    </Button>
                </div>
            </div>


            {openModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/30" onClick={closeModal}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-[#F9A232]/20 transform transition-all duration-300 scale-95 hover:scale-100" onClick={(e) => e.stopPropagation()}>

                        {openModal === 'phone' && (<div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    <Phone className="w-5 h-5 mr-2 text-[#F9A232]"/>
                                    Teléfonos de contacto
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Fijo:</span> {contactInfo.phone.fixed}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Móvil:</span> {contactInfo.phone.mobile}
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button variant="outline" onClick={closeModal} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                        Cerrar
                                    </Button>
                                </div>
                            </div>)}


                        {openModal === 'whatsapp' && (<div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    <MessageCircle className="w-5 h-5 mr-2 text-[#F9A232]"/>
                                    Contactar por WhatsApp
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Número:</span> {contactInfo.whatsapp.number}
                                </p>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button variant="outline" onClick={closeModal} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                        Cerrar
                                    </Button>
                                    <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                                        <a href={contactInfo.whatsapp.link} target="_blank" rel="noopener noreferrer">
                                            Abrir WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            </div>)}


                        {openModal === 'email' && (<div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-[#F9A232]"/>
                                    Enviar correo electrónico
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 break-all">
                                    <span className="font-medium">Correo: </span>{contactInfo.email}
                                </p>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button variant="outline" onClick={closeModal} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                        Cerrar
                                    </Button>
                                    <Button className="bg-[#EA4335] hover:bg-[#D33426] text-white" asChild>
                                        <a href={`mailto:${contactInfo.email}`}>Abrir Gmail</a>
                                    </Button>
                                </div>
                            </div>)}


                        {openModal === 'telegram' && (<div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    <Send className="w-5 h-5 mr-2 text-[#F9A232]"/>
                                    Contactar por Telegram
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className='font-bold'>Usuario: </span> {contactInfo.telegram.number}
                                </p>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button variant="outline" onClick={closeModal} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                        Cerrar
                                    </Button>
                                    <Button className="bg-[#0088CC] hover:bg-[#006B9E] text-white" asChild>
                                        <a href={contactInfo.telegram.link} target="_blank" rel="noopener noreferrer">
                                            Abrir Telegram
                                        </a>
                                    </Button>
                                </div>
                            </div>)}


                        {openModal === 'facebook' && (<div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    <Facebook className="w-5 h-5 mr-2 text-[#F9A232]"/>
                                    Síguenos en Facebook
                                </h3>
                                <div className="rounded-md overflow-hidden">
                                    <img src={contactInfo.facebook.previewImage} alt="Vista previa de Facebook" className="w-full h-auto"/>
                                </div>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button variant="outline" onClick={closeModal} className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                        Cerrar
                                    </Button>
                                    <Button className="bg-[#1877F2] hover:bg-[#166FE5] text-white" asChild>
                                        <a href={contactInfo.facebook.page} target="_blank" rel="noopener noreferrer">
                                            Visitar página
                                        </a>
                                    </Button>
                                </div>
                            </div>)}
                    </div>
                </div>)}
        </>);
};
