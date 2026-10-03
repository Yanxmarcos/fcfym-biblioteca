import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const horarios = [
    {
        dia: "Lunes",
        bloques: [
            { hora: "9-12", actividades: "Actividades que se puede realizar" },
            { hora: "12-2:30", actividades: "Actividades que se puede realizar" },
        ],
    },
    {
        dia: "Martes",
        bloques: [
            { hora: "9-12", actividades: "Actividades que se puede realizar" },
            { hora: "12-2:30", actividades: "Actividades que se puede realizar" },
        ],
    },
    {
        dia: "Miércoles",
        bloques: [
            { hora: "9-12", actividades: "Actividades que se puede realizar" },
            { hora: "12-2:30", actividades: "Actividades que se puede realizar" },
        ],
    },
    {
        dia: "Jueves",
        bloques: [
            { hora: "9-12", actividades: "Actividades que se puede realizar" },
            { hora: "12-2:30", actividades: "Actividades que se puede realizar" },
        ],
    },
    {
        dia: "Viernes",
        bloques: [
            { hora: "9-12", actividades: "Actividades que se puede realizar" },
            { hora: "12-2:30", actividades: "Actividades que se puede realizar" },
        ],
    },
];
export default function HorariosPage() {
    return (<div className="p-8 bg-gradient-to-br from-white-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent">
            Horarios de Atención
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Aquí puedes ver cambios en el horario de atención en los días de esta semana.
          </p>
        </header>
      <Tabs defaultValue="Lunes" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          {horarios.map((horario) => (<TabsTrigger key={horario.dia} value={horario.dia}>
              {horario.dia}
            </TabsTrigger>))}
        </TabsList>
        {horarios.map((horario) => (<TabsContent key={horario.dia} value={horario.dia}>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {horario.bloques.map((bloque, index) => (<div key={index} className="border border-coral-light rounded-lg p-4 bg-secondary">
                  <h2 className="text-xl font-semibold text-coral-dark">
                    {bloque.hora}
                  </h2>
                  <p className="text-readable-secondary">{bloque.actividades}</p>
                </div>))}
            </div>
          </TabsContent>))}
      </Tabs>
    </div>);
}
