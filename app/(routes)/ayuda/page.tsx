"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, SetStateAction } from "react";
import { Phone, ChevronDown, ChevronUp, X, MessageCircle, HeadphonesIcon } from "lucide-react";
export default function AyudaPage() {
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showFAQ, setShowFAQ] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(null);
    const faqRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const contactInfo = {
        phone: {
            fixed: '+51 44 223676',
            mobile: '+51 987654321  |  +51 987777332'
        }
    };
    const faqs = [
        {
            question: "¿Cómo puedo renovar un libro prestado?",
            answer: "Puedes renovar tus libros ingresando a tu cuenta en el sistema bibliotecario online, presentándote físicamente en la biblioteca con tu carné universitario, o llamando a nuestros teléfonos. Las renovaciones están sujetas a disponibilidad y no deben tener reservas pendientes."
        },
        {
            question: "¿Cuál es el horario de atención de la biblioteca?",
            answer: "La biblioteca de la Facultad de Ciencias Físicas y Matemáticas atiende de lunes a viernes de 7:00 AM a 9:00 PM, y los sábados de 8:00 AM a 4:00 PM. Durante períodos de exámenes el horario se extiende hasta las 10:00 PM."
        },
        {
            question: "¿Cómo accedo a las bases de datos científicas?",
            answer: "Para acceder a las bases de datos como IEEE, Springer, ScienceDirect, debes usar la red universitaria o VPN institucional. Ingresa con tu usuario y contraseña universitaria. Si tienes problemas, contacta al área de sistemas bibliotecarios."
        },
        {
            question: "¿Qué documentos necesito para solicitar un préstamo?",
            answer: "Necesitas presentar tu carné universitario vigente y estar matriculado en el semestre actual. Los estudiantes pueden llevar hasta 3 libros por 7 días, mientras que docentes pueden solicitar hasta 5 libros por 15 días."
        },
        {
            question: "¿Cómo reservo una sala de estudio grupal?",
            answer: "Las salas de estudio se reservan presencialmente en el mostrador de información con 24 horas de anticipación. Debes presentar la lista de integrantes con sus respectivos carnés universitarios. Máximo 4 horas por día."
        },
        {
            question: "¿Dónde encuentro tesis de pregrado y postgrado?",
            answer: "Las tesis están disponibles en el repositorio digital de la universidad y en la sección de tesis físicas del segundo piso. Para acceso digital, ingresa al catálogo online con tu usuario universitario."
        },
        {
            question: "¿Cómo solicito la digitalización de un documento?",
            answer: "Puedes solicitar la digitalización de hasta 50 páginas por día presentando tu carné universitario. El servicio es gratuito para estudiantes y tiene un costo mínimo para externos. Tiempo de entrega: 24-48 horas."
        },
        {
            question: "¿Qué hacer si pierdo un libro de la biblioteca?",
            answer: "Debes reportar inmediatamente la pérdida y reponer el libro con uno nuevo e idéntico, o pagar el costo de reposición según la valorización actual. También aplica una multa administrativa según el reglamento."
        }
    ];
    const handleFAQToggle = () => {
        if (!showFAQ) {
            setShowFAQ(true);
            setTimeout(() => {
                faqRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        else {
            setShowFAQ(false);
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const toggleFAQItem = (index: any) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };
    return (<div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-4 md:p-8" ref={topRef}>

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent">
            Centro de Ayuda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Biblioteca de la Facultad de Ciencias Físicas y Matemáticas - UNT
          </p>
        </header>


        <main className="max-w-7xl mx-auto">

          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">

              <Card className="w-full md:w-72 h-72 flex flex-col items-center justify-center rounded-3xl border-2 border-amber-200 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="flex items-center justify-center p-0">
                  <div className="text-7xl mb-6 animate-pulse">❓</div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <CardTitle className="text-amber-700 mb-6 text-center text-lg font-semibold">
                    Preguntas frecuentes
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg transform transition-all duration-200 hover:scale-105 rounded-full px-6 py-2" onClick={handleFAQToggle}>
                    {showFAQ ? 'Ocultar preguntas' : 'Ver preguntas'}
                  </Button>
                </CardContent>
              </Card>


              <Card className="w-full md:w-72 h-72 flex flex-col items-center justify-center rounded-3xl border-2 border-amber-200 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="flex items-center justify-center p-0">
                  <div className="text-7xl mb-6 animate-pulse">📖</div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <CardTitle className="text-amber-700 mb-6 text-center text-lg font-semibold">
                    Manuales de ayuda
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg transform transition-all duration-200 hover:scale-105 rounded-full px-6 py-2">
                    Descargar
                  </Button>
                </CardContent>
              </Card>


              <Card className="w-full md:w-72 h-72 flex flex-col items-center justify-center rounded-3xl border-2 border-amber-200 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="flex items-center justify-center p-0">
                  <div className="text-7xl mb-6 animate-pulse">📜</div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <CardTitle className="text-amber-700 mb-6 text-center text-lg font-semibold">
                    Reglamentos
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg transform transition-all duration-200 hover:scale-105 rounded-full px-6 py-2">
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>


          <section className="relative">
            <div className="bg-gradient-to-r from-amber-500/20 via-orange-400/20 to-yellow-400/20 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border-2 border-amber-200 backdrop-blur-sm dark:bg-white">
              <div className="absolute inset-0 bg-white/30 rounded-3xl dark:bg-white"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left dark:bg-white">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl animate-bounce">💬</div>
                    <div>
                      <h3 className="text-2xl font-bold text-amber-800 mb-2">
                        ¿No encuentras lo que buscas?
                      </h3>
                      <p className="text-amber-700 text-lg">
                        Nuestro equipo está listo para ayudarte
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-xl transform transition-all duration-200 hover:scale-105 rounded-full px-8 py-3 text-lg font-medium" onClick={() => setShowPhoneModal(true)}>
                      <Phone className="w-5 h-5 mr-2"/>
                      Contactar soporte
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>


        {showFAQ && (<section ref={faqRef} className="mt-16 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-amber-800 flex items-center gap-3">
                  <span className="text-4xl">❓</span>
                  Preguntas Frecuentes
                </h2>
                <Button variant="ghost" size="lg" onClick={handleFAQToggle} className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-full p-3">
                  <ChevronUp className="w-6 h-6"/>
                </Button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (<div key={index} className="border border-amber-200 rounded-xl overflow-hidden bg-white/50">
                    <button onClick={() => toggleFAQItem(index)} className="w-full px-6 py-4 text-left hover:bg-amber-50 transition-colors duration-200 flex items-center justify-between group">
                      <span className="font-medium text-amber-800 group-hover:text-amber-900">
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-amber-600 transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''}`}/>
                    </button>
                    {openFAQ === index && (<div className="px-6 pb-4 text-gray-700 bg-amber-50/50 animate-in slide-in-from-top-2 duration-300">
                        {faq.answer}
                      </div>)}
                  </div>))}
              </div>

              <div className="mt-8 text-center">
                <Button onClick={handleFAQToggle} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg transform transition-all duration-200 hover:scale-105 rounded-full px-8 py-3">
                  <ChevronUp className="w-5 h-5 mr-2"/>
                  Volver arriba
                </Button>
              </div>
            </div>
          </section>)}
      </div>


      {showPhoneModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowPhoneModal(false)}>
          <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-amber-200 transform transition-all duration-300 scale-95 hover:scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-400 flex items-center">
                  <HeadphonesIcon className="w-6 h-6 mr-3 text-amber-600"/>
                  Contacto directo
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPhoneModal(false)} className="text-gray-500 hover:text-gray-700 rounded-full p-2">
                  <X className="w-5 h-5"/>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                  <p className="text-amber-800 dark:text-amber-300 font-medium mb-2">
                    📞 Teléfono fijo
                  </p>
                  <p className="text-xl font-bold text-amber-900 dark:text-amber-200">
                    {contactInfo.phone.fixed}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                  <p className="text-orange-800 dark:text-orange-300 font-medium mb-2">
                    📱 Teléfonos móviles
                  </p>
                  <p className="text-xl font-bold text-orange-900 dark:text-orange-200">
                    {contactInfo.phone.mobile}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Horario de atención: Lunes a Viernes 7:00 AM - 9:00 PM
                </p>
                <Button onClick={() => setShowPhoneModal(false)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg rounded-full px-6 py-2">
                  Entendido
                </Button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
