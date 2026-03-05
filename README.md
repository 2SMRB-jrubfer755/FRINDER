<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/2SMRB-jrubfer755/FRINDER/blob/f2fef553e38a883e60a25f121a5434f07b5492bb/FRINDER_LOGO.png" />
</div>
Frinder

Frinder es una aplicación pensada para conectar personas de forma sencilla, humana y natural. Nace con la idea de facilitar el encuentro entre personas afines, reduciendo la fricción típica de otras plataformas y poniendo el foco en la experiencia real del usuario.

La app apuesta por la cercanía, la autenticidad y la utilidad práctica: encontrar a las personas adecuadas en el momento adecuado, sin complicaciones innecesarias.

¿Qué es Frinder?

Frinder combina descubrimiento inteligente y diseño intuitivo para ayudarte a encontrar personas con intereses compatibles, ya sea para amistad, planes, networking u otros tipos de conexión social. Todo desde una interfaz clara y accesible.

No se trata solo de hacer match, sino de crear conexiones que tengan sentido.

Filosofía del producto

• Simplicidad antes que saturación de funciones • Experiencias reales por encima de métricas vacías • Respeto por el tiempo y la privacidad del usuario • Diseño limpio, moderno y centrado en personas

¿Para quién es Frinder?

Frinder está pensada para personas que quieren conocer gente nueva sin sentirse atrapadas en dinámicas artificiales. Usuarios que valoran las conexiones auténticas, la transparencia y una experiencia digital bien cuidada.

Principales características

• Descubrimiento de personas de forma intuitiva • Perfiles claros y directos • Experiencia rápida y sin fricción • Enfoque en afinidad real y no solo en apariencia

Visión

Frinder busca convertirse en una referencia en la forma en la que las personas se descubren y conectan digitalmente. Una app que se sienta cercana, útil y honesta, y que evolucione junto a su comunidad.

Estado del proyecto

Frinder se encuentra en desarrollo activo. La visión es crecer de forma progresiva, escuchando a los usuarios y priorizando siempre la calidad de la experiencia.

Frinder — encuentra a las personas que encajan contigo.

## 🚀 Despliegue con Docker

### Prerrequisitos
- Docker y Docker Compose instalados
- Puertos 3000, 5000 y 27017 disponibles

### Despliegue Rápido
```bash
# Construir y ejecutar todos los servicios
npm run docker:build
npm run docker:up

# Ver logs
npm run docker:logs
```

### Acceder a la aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Comandos útiles
```bash
# Detener servicios
npm run docker:down

# Limpiar contenedores y volúmenes
npm run docker:clean

# Ver estado de servicios
docker compose ps
```

### Solución de problemas
- Si hay errores de build, ejecuta `npm run docker:clean` y luego `npm run docker:build`
- Asegúrate de que los puertos estén libres
- Los healthchecks pueden tardar hasta 2 minutos
