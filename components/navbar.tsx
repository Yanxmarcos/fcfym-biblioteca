'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { SetStateAction, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ContactModals } from '@/components/ContactModals';
import { Home, Settings, Bell, Clock, HelpCircle, Moon, Sun, Type, Phone, MessageCircle, Mail, Send, Facebook, User, BookOpen, ChevronDown, Minus, Plus, LogIn } from 'lucide-react';
import { useAuthContext } from '@/contexts/authContext';
export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [fontSize, setFontSize] = useState('medium');
    const pathname = usePathname();
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const { isAuthenticated, userData, logout } = useAuthContext();
    const [showNotifications, setShowNotifications] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const notifications = [
        {
            id: 1,
            title: "Libro listo para recojo",
            message: 'El libro "Cálculo Infinitesimal" reservado el 20 de junio, está listo para su recojo hasta el 8 de julio.',
            time: "Hace 2 horas",
            type: "ready",
            image: "/mis-reservas.webp",
            isRead: false
        },
        {
            id: 2,
            title: "Libro disponible",
            message: 'El libro "Física Universitaria" reservado el 18 de junio, está listo para su recojo hasta el 10 de julio.',
            time: "Hace 5 horas",
            type: "ready",
            image: "/mis-reservas.webp",
            isRead: false
        },
        {
            id: 3,
            title: "Préstamo por vencer",
            message: 'Su préstamo del libro "Breve Historia del Tiempo" caducará el 12 de julio. No olvide entregarlo en la fecha indicada.',
            time: "Hace 1 día",
            type: "warning",
            image: "/mis-prestamos.webp",
            isRead: true
        }
    ];
    useEffect(() => {
        setMounted(true);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        setUnreadNotifications(unreadCount);
        if (isAuthenticated && userData?.email) {
            const pngPath = `/${userData.email}/foto-usuario.png`;
            const jpgPath = `/${userData.email}/foto-usuario.jpg`;
            fetch(pngPath, { method: 'HEAD' })
                .then(res => {
                if (res.ok) {
                    setAvatarSrc(pngPath);
                }
                else {
                    return fetch(jpgPath, { method: 'HEAD' });
                }
            })
                .then(res => {
                if (res && res.ok) {
                    setAvatarSrc(jpgPath);
                }
            })
                .catch(() => {
                setAvatarSrc(null);
            });
        }
    }, [isAuthenticated, userData]);
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    const changeFontSize = (size: SetStateAction<string>) => {
        setFontSize(size);
        document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
        if (size === 'small')
            document.documentElement.classList.add('text-sm');
        else if (size === 'large')
            document.documentElement.classList.add('text-lg');
        else
            document.documentElement.classList.add('text-base');
    };
    if (!mounted) {
        return null;
    }
    const getUserName = () => {
        if (!userData)
            return 'Mi cuenta';
        return `${userData.nombres} ${userData.apellido_paterno} ${userData.apellido_materno}`;
    };
    const getFontSizeLabel = () => {
        switch (fontSize) {
            case 'small': return 'Pequeño';
            case 'large': return 'Grande';
            default: return 'Normal';
        }
    };
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };
    const markAsRead = (notificationId: any) => {
        console.log('Marcando como leída la notificación:', notificationId);
    };
    const markAllAsRead = () => {
        setUnreadNotifications(0);
        console.log('Todas las notificaciones marcadas como leídas');
    };
    return (<>
      <nav className="w-full bg-gradient-to-b from-secondary to-primary/10 dark:bg-gray-900 shadow-sm" role="navigation" aria-label="Navegación principal">

        <div className="flex items-center justify-between px-5 py-0 border-b-2 border-coral dark:border-gray-700">

          <div className="flex items-center space-x-4">
            <div className="mx-0">
              <Image src="/LOGO-UNT.webp" alt="Logo Universidad Nacional de Trujillo" width={110} height={110} className="object-cover"/>
            </div>

            <div className="border-r-2 border-coral dark:border-gray-700 h-23 mx-3" aria-hidden="true"></div>

            <div>
              <div className="font-bold text-[#B26539] dark:text-gray-100 tracking-wide">
                <p className="text-center text-[15px]">FACULTAD DE CIENCIAS<br />
                  FÍSICAS Y MATEMÁTICAS</p>
              </div>
              <div className="flex flex-col items-center font-medium text-gray-700 dark:text-gray-400 mt-1">
                <p className="text-center text-[15px]">Universidad Nacional Trujillo<br />
                  (UNT)</p>
              </div>
            </div>
          </div>


          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-[#B26539] dark:text-white tracking-wide">
              BIBLIOTECA ESPECIALIZADA
            </h1>
          </div>

          <div className="relative w-[200px] h-[130px] overflow-hidden my-0 mr-20">
            <Image src="/4.webp" alt="Imagen representativa de la biblioteca" fill className="object-cover scale-108"/>
          </div>

          <ContactModals />
        </div>


        <div className="flex items-center justify-between px-6 py-3 bg-gray-100 dark:bg-gray-800 border-b-2 border-coral dark:border-gray-700">

          <div className="flex space-x-8">
            <Link href="/" className={`flex items-center space-x-2 font-medium group relative pb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 rounded-sm ${pathname === '/'
            ? 'text-coral border-b-2 border-coral'
            : 'text-gray-700 dark:text-gray-300 hover:text-coral'}`} aria-current={pathname === '/' ? 'page' : undefined}>
              <Home className="w-5 h-5" aria-hidden="true"/>
              <span className="tracking-wide">Inicio</span>
              {pathname === '/' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-coral" aria-hidden="true"></div>}
              {pathname !== '/' && <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-coral transition-all duration-300" aria-hidden="true"></div>}
            </Link>

            <Link href="/servicios" className={`flex items-center space-x-2 font-medium group relative pb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 rounded-sm ${pathname === '/servicios'
            ? 'text-coral border-b-2 border-coral'
            : 'text-gray-700 dark:text-gray-300 hover:text-coral'}`} aria-current={pathname === '/servicios' ? 'page' : undefined}>
              <Settings className="w-5 h-5" aria-hidden="true"/>
              <span className="tracking-wide">Servicios</span>
              {pathname === '/servicios' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-coral" aria-hidden="true"></div>}
              {pathname !== '/servicios' && <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-coral transition-all duration-300" aria-hidden="true"></div>}
            </Link>

            <Link href="/noticias" className={`flex items-center space-x-2 font-medium group relative pb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 rounded-sm ${pathname === '/noticias'
            ? 'text-coral border-b-2 border-coral'
            : 'text-gray-700 dark:text-gray-300 hover:text-coral'}`} aria-current={pathname === '/noticias' ? 'page' : undefined}>
              <Bell className="w-5 h-5" aria-hidden="true"/>
              <span className="tracking-wide">Noticias</span>
              {pathname === '/noticias' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-coral" aria-hidden="true"></div>}
              {pathname !== '/noticias' && <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-coral transition-all duration-300" aria-hidden="true"></div>}
            </Link>

            <Link href="/horarios" className={`flex items-center space-x-2 font-medium group relative pb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 rounded-sm ${pathname === '/horarios'
            ? 'text-coral border-b-2 border-coral'
            : 'text-gray-700 dark:text-gray-300 hover:text-coral'}`} aria-current={pathname === '/horarios' ? 'page' : undefined}>
              <Clock className="w-5 h-5" aria-hidden="true"/>
              <span className="tracking-wide">Horarios</span>
              {pathname === '/horarios' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-coral" aria-hidden="true"></div>}
              {pathname !== '/horarios' && <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-coral transition-all duration-300" aria-hidden="true"></div>}
            </Link>

            <Link href="/ayuda" className={`flex items-center space-x-2 font-medium group relative pb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 rounded-sm ${pathname === '/ayuda'
            ? 'text-coral border-b-2 border-coral'
            : 'text-[#B26539] dark:text-gray-300 hover:text-coral'}`} aria-current={pathname === '/ayuda' ? 'page' : undefined}>
              <HelpCircle className="w-5 h-5 font-bold" aria-hidden="true"/>
              <span className="tracking-wide font-bold">Ayuda</span>
              {pathname === '/ayuda' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-coral" aria-hidden="true"></div>}
              {pathname !== '/ayuda' && <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-coral transition-all duration-300" aria-hidden="true"></div>}
            </Link>


            {isAuthenticated && (<Link href={`/biblioteca/${userData?.tipo_usuario}`} className={`flex items-center space-x-2 font-medium group relative pb-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 rounded-sm ${pathname.startsWith('/biblioteca/')
                ? 'text-coral border-b-2 border-coral'
                : 'text-gray-700 dark:text-gray-300 hover:text-coral'}`} aria-current={pathname.startsWith('/biblioteca/pr') ? 'page' : undefined}>
                <BookOpen className="w-5 h-5" aria-hidden="true"/>
                <span className="tracking-wide">Biblioteca</span>
                {pathname.startsWith('/biblioteca/') && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-coral" aria-hidden="true"></div>}
                {pathname !== `/biblioteca/${userData?.tipo_usuario}` && <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-coral transition-all duration-300" aria-hidden="true"></div>}
              </Link>)}
          </div>


          <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 p-1">

            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50" aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} title={`Activar modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>
                {theme === 'dark' ? (<Sun className="w-4 h-4 text-yellow-500" aria-hidden="true"/>) : (<Moon className="w-4 h-4 text-blue-600" aria-hidden="true"/>)}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {theme === 'dark' ? 'Claro' : 'Oscuro'}
                </span>
              </Button>
            </div>


            <div className="w-px h-6 bg-gray-300 dark:bg-gray-500" aria-hidden="true"></div>


            <div className="flex items-center space-x-1">

              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2 min-w-[60px] text-center">
                {getFontSizeLabel()}
              </span>

              <Button variant="ghost" size="sm" onClick={() => changeFontSize('small')} className={`p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 ${fontSize === 'small'
            ? 'bg-coral text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'}`} aria-label="Tamaño de texto pequeño" title="Texto pequeño" aria-pressed={fontSize === 'small'}>
                <span className="text-xs">A</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => changeFontSize('medium')} className={`p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 ${fontSize === 'medium'
            ? 'bg-coral text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'}`} aria-label="Tamaño de texto normal" title="Texto normal" aria-pressed={fontSize === 'medium'}>
                <span className="text-base">A</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => changeFontSize('large')} className={`p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coral focus:ring-opacity-50 ${fontSize === 'large'
            ? 'bg-coral text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'}`} aria-label="Tamaño de texto grande" title="Texto grande" aria-pressed={fontSize === 'large'}>
                <span className="text-xl">A</span>
              </Button>
            </div>
          </div>


          <div className="flex items-center space-x-6">

            {isAuthenticated ? (<div className="flex items-center space-x-2">

                <div className="relative">
  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 overflow-hidden flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200">
    {avatarSrc ? (<Image src={avatarSrc} alt="Avatar de usuario" width={56} height={56} className="object-cover w-full h-full"/>) : (<User className="w-5 h-5 text-orange-600" aria-hidden="true"/>)}
  </div>
        </div>


                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight pl-1 mb-1">
                    {getUserName()}
                  </span>

                  <div className="flex space-x-2">

                    <div className="relative group">
                      <Button variant="ghost" size="sm" className="flex items-center border-orange-200 bg-orange-50 space-x-1 px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 border dark:hover:border-gray-600 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 shadow-sm hover:shadow-md cursor-pointer" aria-label="Menú de usuario" aria-expanded="false" aria-haspopup="true">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                          <span className='font-bold'>Cuenta: </span> {userData?.tipo_usuario
                ? userData.tipo_usuario.charAt(0).toUpperCase() + userData.tipo_usuario.slice(1)
                : 'Desconocido'}
                        </span>
                        <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true"/>
                      </Button>


                      <div className="absolute right-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 hidden group-hover:block transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 overflow-hidden" role="menu" aria-orientation="vertical">

                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-orange-50 dark:bg-gray-750">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                              <User className="w-4 h-4 text-white" aria-hidden="true"/>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {getUserName()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Gestiona tu cuenta
                              </p>
                            </div>
                          </div>
                        </div>


                        <div className="py-2">
                          <Link href="/mi-cuenta" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors duration-150 group/item focus:outline-none focus:bg-orange-50 dark:focus:bg-gray-700" role="menuitem">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-gray-600 flex items-center justify-center mr-3 group-hover/item:bg-orange-200 dark:group-hover/item:bg-gray-500 transition-colors duration-150">
                              <User className="w-4 h-4 text-orange-600 dark:text-gray-300" aria-hidden="true"/>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Mi cuenta</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Configuración y perfil
                              </p>
                            </div>
                            <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150" aria-hidden="true"/>
                          </Link>

                          <div className="mx-4 my-2 border-t border-gray-100 dark:border-gray-700" aria-hidden="true"></div>

                          <button className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 group/item focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20" onClick={logout} role="menuitem">
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 group-hover/item:bg-red-200 dark:group-hover/item:bg-red-900/50 transition-colors duration-150">
                              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"/>
                              </svg>
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium">Cerrar sesión</p>
                              <p className="text-xs text-red-400 dark:text-red-500">
                                Salir de la aplicación
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>


                    <Button size="icon" onClick={toggleNotifications} className="relative border-orange-200 bg-orange-50 text-gray-500 border-x-1 border-y-1 h-8 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50" aria-label={`Notificaciones${unreadNotifications > 0 ? `, ${unreadNotifications} sin leer` : ''}`} title="Ver notificaciones">
                      <Bell className="w-5 h-5" aria-hidden="true"/>
                      {unreadNotifications > 0 && (<>
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#59ff24] rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-800">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>
                          </span>
                          <span className="sr-only">{unreadNotifications} notificaciones sin leer</span>
                        </>)}
                    </Button>
                  </div>
                </div>
              </div>) : (<Link href="/login">
                <Button className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                  <LogIn className="w-5 h-5" aria-hidden="true"/>
                  <span>Ingresar</span>
                </Button>
              </Link>)}
          </div>
        </div>
      </nav>


      {showNotifications && (<>

          <div className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300" onClick={() => setShowNotifications(false)} aria-hidden="true"/>


          <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">

            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-750">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-white" aria-hidden="true"/>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Notificaciones
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {unreadNotifications > 0 ? `${unreadNotifications} sin leer` : 'Todas leídas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {unreadNotifications > 0 && (<Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md font-medium transition-colors duration-200" title="Marcar todas como leídas">
                    Marcar todas
                  </Button>)}

                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)} className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" aria-label="Cerrar notificaciones" title="Cerrar panel">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </div>


            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
              <div className="p-2">
                {notifications.length === 0 ? (<div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-gray-400" aria-hidden="true"/>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      No tienes notificaciones
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Te notificaremos cuando tengas algo nuevo
                    </p>
                  </div>) : (<div className="space-y-2">
                    {notifications.map((notification) => (<div key={notification.id} className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer group ${notification.isRead
                        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'}`} onClick={() => markAsRead(notification.id)} role="button" tabIndex={0} aria-label={`Notificación: ${notification.title}`}>

                        {!notification.isRead && (<div className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full"></div>)}

                        <div className="flex items-start space-x-3">

                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Image src={notification.image} alt={`Icono de ${notification.title}`} width={48} height={48} className="object-cover"/>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                              <BookOpen className="w-6 h-6 text-white" aria-hidden="true"/>
                            </div>
                          </div>


                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <p className={`font-semibold text-sm leading-5 ${notification.isRead
                        ? 'text-gray-800 dark:text-gray-200'
                        : 'text-gray-900 dark:text-gray-100'}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                                {notification.time}
                              </span>
                            </div>

                            <p className={`text-sm mt-1 leading-relaxed ${notification.isRead
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-gray-700 dark:text-gray-300'}`}>
                              {notification.message}
                            </p>


                            <div className="flex items-center mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notification.type === 'ready'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                {notification.type === 'ready' ? 'Listo para recojo' : 'Próximo a vencer'}
                              </span>
                            </div>
                          </div>
                        </div>


                        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-orange-300 dark:group-hover:border-orange-600 transition-colors duration-200 pointer-events-none"></div>
                      </div>))}
                  </div>)}
              </div>
            </div>
          </div>
        </>)}
    </>);
}
