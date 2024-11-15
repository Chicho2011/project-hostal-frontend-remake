FROM docker.uclv.cu/node:20.14.0 AS build-stage

#Directorio de trabajo
WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .


# Establecer variable de entorno para aumentar la memoria durante el proceso de construcción
ENV NODE_OPTIONS="--max-old-space-size=8192"

ARG NUXT_API_ENDPOINT
ENV NUXT_API_ENDPOINT=${NUXT_API_ENDPOINT}

RUN npm run build

FROM docker.uclv.cu/node:20.14.0 AS production-stage

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios desde la etapa de build
COPY --from=build-stage /app/.output ./.output
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/package*.json ./

# Configurar variable de entorno para producción
ENV NODE_ENV=production

# Exponer el puerto 3000 (el puerto por defecto de Nuxt 3)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", ".output/server/index.mjs"]